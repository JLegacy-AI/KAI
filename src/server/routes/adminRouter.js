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
});
