import { z } from "zod";

export const registerSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100),
  rut: z
    .string({ required_error: "Rut is required" })
    .min(10, {
      message: "Rut must be 10 characters",
    })
    .max(10),
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(3)
    .max(100),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(9)
    .max(9),
  address: z.string({ required_error: "Address is required" }).min(3).max(100),
  isAdmin: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email",
  }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100),
});
