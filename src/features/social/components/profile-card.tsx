"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { User, Mail, Calendar, Sparkles, Globe, Link2, Share2, Edit3, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema } from "@/features/profile/contracts/profile.contract";
import { updateProfileAction } from "@/actions/profile.actions";
import { FollowButton } from "./follow-button";
import { z } from "zod";


type FormValues = z.infer<typeof profileUpdateSchema>;

interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  bio: string | null;
  headline: string | null;
  socialLinks: any;
  points: number;
  createdAt: Date;
  _count: {
    followers: number;
    following: number;
    portfolioProjects: number;
  };
}

interface ProfileCardProps {
  user: ProfileUser;
  isOwnProfile: boolean;
  initialFollowing: boolean;
}

export function ProfileCard({ user, isOwnProfile, initialFollowing }: ProfileCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socials = user.socialLinks || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      headline: user.headline || "",
      bio: user.bio || "",
      twitter: socials.twitter || "",
      linkedin: socials.linkedin || "",
      github: socials.github || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const res = await updateProfileAction(data);
      if (!res.success) {
        setError(res.error || "Failed to update profile.");
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <CardContent className="p-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 mb-6 gap-4">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-900 shadow-md">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800">
              <User className="h-10 w-10 text-neutral-400" />
            </AvatarFallback>
          </Avatar>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-9 rounded-xl text-xs gap-1.5"
              >
                <Edit3 className="h-3.5 w-3.5" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            ) : (
              <FollowButton targetUserId={user.id} initialFollowing={initialFollowing} />
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-bold">Display Name</Label>
                <Input id="name" {...register("name")} className="h-10 rounded-xl" />
                {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="headline" className="text-xs font-bold">Headline / Subtitle</Label>
                <Input id="headline" placeholder="e.g. Next.js Expert & Student" {...register("headline")} className="h-10 rounded-xl" />
                {errors.headline && <p className="text-[10px] text-red-500 font-medium">{errors.headline.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio" className="text-xs font-bold">Bio</Label>
              <Textarea id="bio" placeholder="Write something about your experiences..." rows={4} {...register("bio")} className="rounded-xl resize-none text-xs" />
              {errors.bio && <p className="text-[10px] text-red-500 font-medium">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="twitter" className="text-xs font-bold flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Twitter URL</Label>
                <Input id="twitter" placeholder="https://twitter.com/..." {...register("twitter")} className="h-10 rounded-xl text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="linkedin" className="text-xs font-bold flex items-center gap-1"><Link2 className="h-3.5 w-3.5" /> LinkedIn URL</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedin")} className="h-10 rounded-xl text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="github" className="text-xs font-bold flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> GitHub URL</Label>
                <Input id="github" placeholder="https://github.com/..." {...register("github")} className="h-10 rounded-xl text-xs" />
              </div>
            </div>


            {error && <p className="text-[11px] text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg font-semibold">{error}</p>}

            <Button type="submit" disabled={isPending} className="h-10 rounded-xl text-xs w-full gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-850 dark:text-neutral-50 flex items-center gap-2">
                {user.name || "Anonymous Learner"}
                <span className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-bold rounded">
                  {user.role}
                </span>
              </h2>
              {user.headline && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">
                  {user.headline}
                </p>
              )}
            </div>

            {user.bio && (
              <p className="text-xs text-neutral-600 dark:text-neutral-350 leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-neutral-500 font-medium py-2 border-y border-neutral-100 dark:border-neutral-800/50">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4 text-neutral-400" /> {user.email}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-neutral-400" /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-amber-500"><Sparkles className="h-4 w-4 fill-amber-500" /> {user.points} XP Points</span>
            </div>

            <div className="flex gap-6 text-xs text-neutral-500 font-bold">
              <div>
                <span className="text-neutral-800 dark:text-neutral-200 text-sm font-extrabold mr-1">{user._count.followers}</span>
                Followers
              </div>
              <div>
                <span className="text-neutral-800 dark:text-neutral-200 text-sm font-extrabold mr-1">{user._count.following}</span>
                Following
              </div>
              <div>
                <span className="text-neutral-800 dark:text-neutral-200 text-sm font-extrabold mr-1">{user._count.portfolioProjects}</span>
                Projects
              </div>
            </div>

            {/* Social links */}
            {(socials.twitter || socials.linkedin || socials.github) && (
              <div className="flex gap-2.5 pt-2">
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noreferrer" className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noreferrer" className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition-colors">
                    <Link2 className="h-4 w-4" />
                  </a>
                )}
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noreferrer" className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition-colors">
                    <Share2 className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
