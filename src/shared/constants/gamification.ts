export const XP_REWARDS = {
  COMPLETE_LESSON: 10,
  PASS_QUIZ: 25,
  ACE_QUIZ: 50,
  COMPLETE_COURSE: 100,
  STREAK_7_DAY: 50,
  STREAK_30_DAY: 200,
  STREAK_100_DAY: 500,
  WRITE_REVIEW: 15,
  ACCEPTED_QA_ANSWER: 20,
  SUBMIT_ASSIGNMENT: 15,
  EARN_CERTIFICATE: 50,
  REFERRAL_CONVERTED: 100,
  CREATE_DISCUSSION: 5,
  ENROLL_COURSE: 10,
};

export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  750,    // Level 5
  1000,   // Level 6
  1500,   // Level 7
  2000,   // Level 8
  2500,   // Level 9
  3000,   // Level 10
  5000,   // Level 11
  7500,   // Level 12
  10000,  // Level 13
  15000,  // Level 25 threshold from spec
  50000,  // Level 50 threshold from spec
];

export const BADGE_DEFINITIONS = [
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Successfully complete 10 quizzes",
    icon: "award",
    xpReward: 100,
    category: "QUIZ",
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Score 100% on a quiz",
    icon: "target",
    xpReward: 50,
    category: "QUIZ",
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Successfully complete 5 courses",
    icon: "trophy",
    xpReward: 250,
    category: "COURSE",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day study streak",
    icon: "zap",
    xpReward: 50,
    category: "STREAK",
  },
  {
    id: "monthly_maven",
    name: "Monthly Maven",
    description: "Maintain a 30-day study streak",
    icon: "flame",
    xpReward: 200,
    category: "STREAK",
  },
  {
    id: "critic",
    name: "Critic",
    description: "Write your first course review",
    icon: "message-square",
    xpReward: 15,
    category: "SOCIAL",
  },
  {
    id: "helpful_hand",
    name: "Helpful Hand",
    description: "Get 10 answers accepted in course Q&As",
    icon: "thumbs-up",
    xpReward: 100,
    category: "COMMUNITY",
  },
];
