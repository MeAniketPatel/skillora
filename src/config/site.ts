export const siteConfig = {
  name: "Skillora",
  titleSuffix: " | Skillora",
  description:
    "Skillora is a modern e-learning platform where expert teachers create world-class courses and students learn at their own pace.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  creator: "Skillora Team",
  keywords: [
    "e-learning",
    "online courses",
    "education",
    "teaching platform",
    "skillora",
    "learn online",
    "video courses",
  ],
  links: {
    github: "https://github.com/meaniketpatel/skillora",
  },
} as const;

export type SiteConfig = typeof siteConfig;
