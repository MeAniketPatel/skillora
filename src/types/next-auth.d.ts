import type { Role } from "@/core/entities";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      sessionId?: string;
      isNewOAuthUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    sessionId?: string;
    authSessionExpires?: string;
    isNewOAuthUser?: boolean;
  }
}
