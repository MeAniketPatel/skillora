// Import boundary rules to keep the architecture clean.
// Cross-feature imports must go through feature barrels, and
// only repositories should import Prisma directly.
module.exports = {
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        patterns: [
          {
            group: ["@/data/*"],
            message: "Deep imports from @/data/* are forbidden. Use @/features/<feature> barrel.",
          },
          {
            group: ["@/features/*/repositories/*", "@/features/*/actions/*", "@/features/*/components/*"],
            message: "Cross-feature deep imports are forbidden. Use @/features/<feature> barrel.",
          },
          {
            group: ["@/components/auth/*", "@/components/course/*", "@/components/student/*"],
            message: "Legacy component imports are forbidden. Use @/features/<feature> barrel.",
          },
        ],
      },
    ],
  },
};
