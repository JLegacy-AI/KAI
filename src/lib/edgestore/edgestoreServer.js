import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { initEdgeStoreClient } from "@edgestore/server/core";
import { dbConnect } from "@/server/services/mongoose";
import { cookies } from "next/headers";
import { checkAuthByJWT } from "@/lib/serverAuthUtils";
import { z } from "zod";
import {
  embedAndStoreText,
  deleteEmbeddingsByFileId,
} from "@/lib/langchain";
import { countTokens } from "@/lib/utils";
import userModel from "@/server/models/user.model";
import botModel from "@/server/models/bot.model";

async function createContext({ req }) {
  try {
    await dbConnect();
    let token = cookies().get("access-token")?.value;
    if (!token) return {};

    const authResult = await checkAuthByJWT(token, false);
    if (authResult.error) return {};
    if (authResult.isAdmin) return { isAdmin: "true" }; // If isAdmin is boolean edge store
    return { userId: authResult.userId }; // returning the whole user object makes edge store throw validation error, so returning only the userId
  } catch (err) {
    console.log("[error@edgestore_createContext]: ", err.message);
    return { req };
  }
}

const es = initEdgeStore.context().create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  userKbFiles: es
    .fileBucket({
      maxSize: 10 * 1024 * 1024, // 10MB
      accept: ["text/plain"],
    })
    .input(
      z.object({
        id: z.string(), // This is the id of the file
        name: z.string(),
        fileText: z.string(),
        botId: z.string(),
      })
    )
    .path(({ ctx, input }) => [{ botId: input.botId }])
    .metadata(({ ctx, input }) => ({
      id: input.id,
      category: input.category,
      name: input.name,
      userId: ctx.userId,
      botId: input.botId,
    }))
    .beforeUpload(async ({ ctx, input, fileInfo }) => {
      if (!ctx.userId) {
        console.log(
          "[edgestore-userKbFiles] beforeUpload, User not logged in",
          ctx
        );
        return false;
      }

      const user = await userModel.findById(ctx.userId);
      if (!user) {
        console.log(
          "[edgestore-userKbFiles] beforeUpload, User not found"
        );
        return false;
      }

      const remainingTokens = user.tokensGranted - user.tokensUsed;

      const { fileText } = input;
      const fileTextTokens = countTokens(fileText);

      if (fileTextTokens > remainingTokens) {
        console.log(
          `[edgestore-userKbFiles] beforeUpload, Insufficient tokens. Required: ${fileTextTokens}, Remaining: ${remainingTokens}`
        );
        return false;
      }

      const res = await embedAndStoreText(
        fileText,
        {
          fileName: input.name,
          fileBucketName: "userKbFiles",
          fileId: input.id,
          userId: ctx.userId,
          botId: input.botId,
        },
        { namespace: "user" }
      );

      if (res.error) {
        console.log(
          "[edgestore-userKbFiles] beforeUpload, Error embedding and storing text: ",
          res.error
        );
        return false;
      }

      user.tokensUsed = user.tokensUsed + fileTextTokens;
      await user.save();
      
      // update training token count in bot
      await botModel.findByIdAndUpdate(input.botId, {
        $inc: { trainingTokensCount: fileTextTokens }
      });

      return true;
    })
    .beforeDelete(async ({ ctx, fileInfo }) => {
      console.log("[edgestore-userKbFiles] beforeDelete", ctx, fileInfo);

      // Delete Associated Embeddings
      const res = await deleteEmbeddingsByFileId(fileInfo.metadata.id, "user");
      if (res.error) return false;
      return true;
    }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export const esBackendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});
