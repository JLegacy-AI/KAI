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
    displayMessage: z.string(), // The message to be displayed in the chat, from user side
    // Query Types and their required fields
    question: z.object({
      content: z.string(),
    }),
  })
  .refine(
    (schema) => {
      // Check the the field for the query type is present
      return !!schema[schema.queryType];
    },
    (schema) => ({
      message: `The field for the query type ${schema.queryType} is required`,
      path: [schema.queryType],
    })
  );

export function getZodErrorsObj(errors) {
  const errorsObj = {};
  errors.forEach((error) => {
    const path = error.path.join(".");
    errorsObj[path] = error.message;
  });
  return errorsObj;
}
