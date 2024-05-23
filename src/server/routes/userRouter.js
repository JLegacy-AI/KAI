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
});
