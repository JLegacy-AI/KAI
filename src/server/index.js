import { adminRouter } from "./routes/adminRouter";
import { publicProcedure, router } from "./trpc";
import { l } from "@/lib/language";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { ADMIN_JWT_SECRET, USER_JWT_SECRET } from "@/lib/constants";
import { userLoginSchema, userSignupSchema } from "@/lib/zodSchemas";
import userModel from "@/server/models/user.model";
import { userRouter } from "./routes/userRouter";
import {
  clearAuthCookies,
  setAuthCookies,
  signAdminJWT,
  signUserJWT,
} from "@/lib/serverAuthUtils";
import { esBackendClient } from "@/lib/edgestore/edgestoreServer";
import bcrypt from "bcrypt";

export const appRouter = router({
  sayhi: publicProcedure.query(async (opts) => {
    return "Hello World";
  }),
  "admin.login": publicProcedure
    .input(
      z.object({
        password: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { password } = opts.input;
      // If the password is incorrect, throw an unauthorized error
      if (password !== process.env.ADMIN_PASSWORD) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: l("Incorrect Password"),
        });
      }
      // If the password is correct, return a JWT token. Payload doesn't matter
      const token = signAdminJWT({ isAdmin: true });
      setAuthCookies(token, true);

      // Token is already set in the cookies, so no need to return it
      return { message: l("Login Successful") };
    }),
  "admin.logout": publicProcedure.mutation(async (opts) => {
    clearAuthCookies();
    return { message: l("Logout Successful") };
  }),
  admin: adminRouter,
  "user.signup": publicProcedure
    .input(userSignupSchema)
    .mutation(async (opts) => {
      const { name, email, password, confirmPassword } = opts.input;
      // If the email is not unique, throw an error
      const userExists = await userModel.findOne({ email });
      if (userExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: l("User with given email already exists."),
        });
      }
      // Encrypt the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);


      // Create a new user in the mongoDB using userModel
      const user = await userModel.create({ name, email, password: hashedPassword });

      // Remove the password field from the user object
      delete user.password;

      return { message: l("Signup Successful"), data: user };
    }),
  "user.login": publicProcedure
    .input(userLoginSchema)
    .mutation(async (opts) => {
      const { email, password } = opts.input;
      // Find the user with the given email
      const user = await userModel.findOne({ email }).select("+password");
      // If the user is not found, throw an error
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: l("User with given email not found"),
        });
      }

      if(user.isAccountDisabled) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Your account is disabled, Please contact Admin.",
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      // If the password is incorrect, throw an error
      if (!isPasswordCorrect){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: l("Incorrect Password"),
        });
      }
      // If the password is correct, return a JWT token.
      const token = signUserJWT(user.id);
      setAuthCookies(token);
      
      // Token is already set in the cookies, so no need to return it
      return { message: l("Login Successful") };
    }),
  "user.logout": publicProcedure.mutation(async (opts) => {
    clearAuthCookies();
    return { message: l("Logout Successful") };
  }),
  user: userRouter,
});
