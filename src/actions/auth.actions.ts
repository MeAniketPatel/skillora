"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn } from "@/auth";
import db from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TEACHER"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(values: z.infer<typeof registerSchema>) {
  try {
    const validated = registerSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Invalid registration fields." };
    }

    const { name, email, password, role } = validated.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already registered." };
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: "Account created successfully!" };
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return { error: "An unexpected error occurred during registration." };
  }
}

export async function loginUser(values: z.infer<typeof loginSchema>) {
  try {
    const validated = loginSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Invalid login credentials." };
    }

    const { email, password } = validated.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong with sign in." };
      }
    }
    throw error;
  }
}
