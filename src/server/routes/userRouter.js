import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { l } from "@/lib/language";
import {
  askAi,
  explainText,
  messagesToChat,
  summarizeText,
  compareFilesText,
  rewriteText,
} from "@/lib/langchain";
import { z } from "zod";
import ChatSessionModel from "@/server/models/chatSession.model";
import userModel from "../models/user.model";
import chatSessionModel from "@/server/models/chatSession.model";
import { esBackendClient } from "@/lib/edgestore/edgestoreServer";
import { askAiSchema } from "@/lib/zodSchemas";
import { getContentFromFileUrl } from "@/lib/utils";
import botModel from "../models/bot.model";

export const userProcedure = publicProcedure.use(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: l("You are not authorized to access this route"),
    });
  }
  return next();
});

export const userRouter = router({
  get: userProcedure.query(async (opts) => {
    const user = opts.ctx.user;
    return user;
  }),
  getKbFiles: userProcedure
    .input(
      z.object({
        botId: z.string(),
        currentPage: z.number().default(1),
      })
    )
    .query(async (opts) => {
      // TODO do a iteration over all pages, and then return all the files in one go, end pagination
      const { botId, currentPage } = opts.input;
      const user = opts.ctx.user;

      let options = {
        filter: {
          path: {
            userId: user.id,
            botId: botId,
          },
        },
      };

      // As the metadata filter is not working, we will filter the files manually
      let allFiles = await esBackendClient.userKbFiles.listFiles(options);
      return allFiles;
    }),
  "ai.ask": userProcedure.input(askAiSchema).mutation(async (opts) => {
    const user = opts.ctx.user;
    let remainingTokens = user.tokensGranted - user.tokensUsed;

    const { question: query, chatSessionId } = opts.input;

    let thisChatSession = null;

    // Create a new chat session if the chatSessionId is "new", otherwise use the one with given id
    if (chatSessionId === "new") {
      console.log("[askAI] Creating a new session");
      thisChatSession = await ChatSessionModel.create({
        title: opts.input.displayMessage.slice(0, 100),
        messages: [],
        user: user._id,
      });

      user.chats.push(thisChatSession._id);
      await user.save();
    } else {
      console.log("[askAI] Using existing session");
      // Also check if the chat session exists and belongs to the user
      thisChatSession = await ChatSessionModel.findOne(
        {
          _id: chatSessionId,
          user: user._id,
        },
        {
          messages: { $slice: -10 }, // Only get the last 10 messages
        }
      );

      if (!thisChatSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: l("Chat session not found"),
        });
      }
    }

    let aiRes;

    if (queryType === "question") {
      const chatHistory = messagesToChat(thisChatSession.messages);

      aiRes = await askAi({
        question: query.content,
        chatHistory,
        contextType: query.contextType,
        userId: opts.ctx.user.id,
        maxTokens: remainingTokens,
      });

      if (aiRes.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: aiRes.error,
        });
      }
    }

    if (aiRes.error) {
      throw new TRPCError({
        code: aiRes.code ?? "INTERNAL_SERVER_ERROR",
        message: aiRes.error,
      });
    }

    thisChatSession.messages.push({
      message: opts.input.displayMessage,
      role: "user",
    });

    thisChatSession.messages.push({
      message: aiRes.answer,
      role: "ai",
      usage: aiRes.usage,
      tokensUsed: aiRes.tokensUsed,
    });
    await thisChatSession.save();

    // Update tokens in the user object
    user.tokensUsed += aiRes.tokensUsed;
    user.totalTokensUsed += aiRes.tokensUsed;
    await user.save();

    return {
      chatSessionId: thisChatSession._id,
      answer: aiRes.answer,
      usage: aiRes.usage,
      tokensUsed: aiRes.tokensUsed,
    };
  }),
  getChatSessions: userProcedure.query(async (opts) => {
    const user = opts.ctx.user;

    // Find all chat sessions that belong to the user, but don't return the messages
    const chatSessions = await ChatSessionModel.find({ user: user._id })
      .select("-messages")
      .sort({
        createdAt: "desc",
      });

    return chatSessions;
  }),
  getChatSession: userProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      const user = opts.ctx.user;
      const { id } = opts.input;

      const chatSession = await ChatSessionModel.findOne({
        _id: id,
        user: user._id,
      });
      if (!chatSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: l("Chat session not found"),
        });
      }
      return chatSession;
    }),
  deleteChatSession: userProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const user = opts.ctx.user;
      const { id } = opts.input;
      const chatSession = await ChatSessionModel.findOne({
        _id: id,
        user: user._id,
      });
      if (!chatSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: l("Chat session not found"),
        });
      }

      // Delete the chat session and remove the chat id from the user's chats array
      await chatSessionModel.deleteOne({ _id: id });
      await userModel.updateOne({ _id: user._id }, { $pull: { chats: id } });
      return { message: l("Chat session deleted") };
    }),
  buyTokens: userProcedure
    .input(z.object({ tokens: z.number() }))
    .mutation(async (opts) => {
      const user = opts.ctx.user;
      const { tokens } = opts.input;

      user.tokensGranted += tokens;
      await user.save();

      return { message: l("Tokens bought successfully") };
    }),
  createBot: userProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        accessType: z.enum(["public", "private"]).default("private"),
      })
    )
    .mutation(async (opts) => {
      const user = opts.ctx.user;
      const { name, description, accessType } = opts.input;

      const newBot = await botModel.create({
        name,
        description,
        accessType,
        creator: user._id,
      });

      user.bots.push(newBot._id);
      await user.save();

      return newBot;
    }),
  getBots: userProcedure.query(async (opts) => {
    const user = opts.ctx.user;
    // Get array of bots in user model, and popullate them, that way we also get the bots he added from other users

    // Also sort the bots by createdAt date in descending order
    // let userData = await userModel.findOne({ _id: user._id }).populate("bots");
    let userData = await userModel.findOne({ _id: user._id }).populate({
      path: "bots",
      options: { sort: { createdAt: -1 } },
    });

    // Filter out the bots that the user has not created and are private
    const bots = userData.bots.filter(
      (bot) =>
        String(bot.creator) == String(user._id) || bot.accessType == "public"
    );

    return bots;
  }),
  getCommunityBots: userProcedure.query(async (opts) => {
    const user = opts.ctx.user;
    // Get all the bots that are public and not created by the user
    const bots = await botModel
      .find({
        creator: { $ne: user._id },
        accessType: "public",
      })
      .sort({ createdAt: -1 });

    return bots.filter((bot) => !user.bots.includes(bot._id));
  }),
  addBot: userProcedure
    .input(z.object({ botId: z.string() }))
    .mutation(async (opts) => {
      const user = opts.ctx.user;
      const { botId } = opts.input;

      // Check if the bot exists
      const bot = await botModel.findById(botId);
      if (!bot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: l("Bot not found"),
        });
      }

      // Check if the user already has the bot
      if (user.bots.includes(botId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: l("Bot already added"),
        });
      }

      user.bots.push(botId);
      await user.save();

      return { bot: bot , message: l("Bot added successfully") };
    }),
});
