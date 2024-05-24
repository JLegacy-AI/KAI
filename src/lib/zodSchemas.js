import { z } from "zod";
import { l } from "./language";

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, l("Password is required")),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1),
});

export const userSignupSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TODO Probably need botId integration
export const askAiSchema = z
  .object({
    chatSessionId: z.string(),
    // displayMessage: z.string(), // The message to be displayed in the chat, from user side
    // Query Types and their required fields
    question: z.object({
      content: z.string().min(3, "Question must be at least 3 characters long"),
    }),
    botId: z.string().optional(),
  })
  .refine(
    (schema) => {
      // Check the the field for the query type is present
      if (schema.chatSessionId === "new" && !schema.botId) {
        return false;
      }
      return true;
    },
    {
      message: `BotId is required for new chat session`,
      path: ["botId"],
    }
  );

export function getZodErrorsObj(errors) {
  const errorsObj = {};
  errors.forEach((error) => {
    const path = error.path.join(".");
    errorsObj[path] = error.message;
  });
  return errorsObj;
}
