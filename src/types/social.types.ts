export interface SocialActivityItem {
  id: string;
  userId: string;
  userName: string | null;
  userImage: string | null;
  type: "COURSE_ENROLLED" | "LESSON_COMPLETED" | "BADGE_EARNED" | "REVIEW_POSTED";
  referenceId: string;
  metadata?: any;
  createdAt: Date;
}

export interface FollowStatus {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface StudyGroupMember {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  role: "OWNER" | "MEMBER";
  joinedAt: Date;
}
