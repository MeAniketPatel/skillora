import type { Role } from "./role";

export interface UserCore {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileCore {
  userId: string;
  bio: string | null;
  headline: string | null;
  socialLinks: Record<string, string> | null;
}

export const USER_SOCIAL_PLATFORMS = [
  "twitter",
  "linkedin",
  "github",
  "youtube",
  "website",
] as const;
export type UserSocialPlatform = (typeof USER_SOCIAL_PLATFORMS)[number];
