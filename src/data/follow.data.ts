import db from "@/lib/prisma";

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await db.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });
  return !!follow;
}

export async function followUser(followerId: string, followingId: string) {
  const existing = await isFollowing(followerId, followingId);
  if (existing) return null;
  return db.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  return db.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });
}

export async function getFollowers(userId: string) {
  return db.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          image: true,
          headline: true,
        },
      },
    },
  });
}

export async function getFollowing(userId: string) {
  return db.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          image: true,
          headline: true,
        },
      },
    },
  });
}
