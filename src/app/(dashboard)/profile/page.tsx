import { requireAuth } from "@/shared/lib/auth-helpers";
import { getUserProfile } from "@/features/auth/server";
import { ProfileForm } from "./profile-form";

export default async function OwnProfilePage() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  return (
    <ProfileForm
      user={{
        id: user.id,
        name: profile?.name ?? null,
        email: user.email ?? "",
        image: profile?.image ?? null,
        headline: profile?.headline ?? null,
        bio: profile?.bio ?? null,
        socialLinks: (profile?.socialLinks as { twitter?: string; linkedin?: string; github?: string }) || {},
      }}
    />
  );
}
