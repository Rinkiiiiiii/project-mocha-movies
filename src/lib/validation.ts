import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be 20 characters or fewer")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(60).optional().or(z.literal("")),
  username: usernameSchema,
  email: z.string().email("Enter a valid email address"),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ratingSchema = z.object({
  titleId: z.string().min(1),
  score: z.number().int().min(1).max(10),
  review: z.string().max(2000).optional(),
});

export const listEntrySchema = z.object({
  titleId: z.string().min(1),
  status: z.enum(["PLANNING", "WATCHING", "COMPLETED", "DROPPED", "ON_HOLD"]),
  favorite: z.boolean().optional(),
  progress: z.number().int().min(0).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
export type ListEntryInput = z.infer<typeof listEntrySchema>;
