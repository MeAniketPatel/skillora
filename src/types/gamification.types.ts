export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: Date;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;
  badge: BadgeDefinition;
}

export interface LeaderboardEntry {
  userId: string;
  name: string | null;
  image: string | null;
  totalXP: number;
  rank: number;
  level: number;
}
