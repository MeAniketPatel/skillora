// ESLint boundary rules for the enterprise architecture migration.
// Ensures:
// - Cross-feature imports go through feature barrels, not deep paths.
// - Repositories are the only place that imports from @/shared/lib/prisma.
// - App pages can only import from @/features/* and @/shared/*.
// - Components cannot import from @/data (legacy).
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
