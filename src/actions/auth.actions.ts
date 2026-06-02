"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

import { signIn, auth } from "@/auth";
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

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Send onboarding welcome email
    try {
      const { sendWelcomeEmail } = await import("@/lib/mail");
      await sendWelcomeEmail(email, name);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    // Auto-login after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
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

export async function updateUserSettings(values: {
  name?: string;
  email?: string;
  password?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const { name, email, password } = values;
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name) updateData.name = name;

    if (email && email !== session.user.email) {
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return { error: "Email already in use." };
      }
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: "Settings updated successfully!" };
  } catch (error) {
    console.error("[SETTINGS_UPDATE_ERROR]", error);
    return { error: "Failed to update settings." };
  }
}

