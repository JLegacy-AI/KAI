import { l } from "@/lib/language";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { esBackendClient } from "@/lib/edgestore/edgestoreServer";
import { z } from "zod";
import { getAllFilesFromEs } from "@/lib/edgestore/esUtils";
import userModel from "../models/user.model";

export const adminProcedure = publicProcedure.use(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: l("You are not authorized to access this route"),
    });
  }
  return next();
});

export const adminRouter = router({
  getUsers: adminProcedure.query(async () => {
    const res = await userModel.find();
    return res;
  }),
  disableUserAccount: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        isAccountDisabled: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const { userId, isAccountDisabled } = opts.input;

      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User doesn't exist",
        });

      // disable or enable account
      user.isAccountDisabled = isAccountDisabled;
      await user.save();

      return { message: "User access updated successfully!" };
    }),
});
