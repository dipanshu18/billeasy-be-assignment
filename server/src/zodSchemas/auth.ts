import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be 3 characters long" }),
  email: z.string().email({ message: "Please provide a valid email" }),
  password: z
    .string()
    .min(5, { message: "Password must be minimum 5 characters long" }),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
