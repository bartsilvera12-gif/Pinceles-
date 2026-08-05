import next from "eslint-config-next";

/** Config flat de ESLint 9 usando la configuración nativa de Next.js 16. */
const eslintConfig = [
  ...next,
  {
    ignores: [
      "legacy/**",
      "supabase/**",
      "scripts/**",
      ".next/**",
      "node_modules/**",
      "public/**",
      ".claude/**",
      "support.js",
      "next.config.mjs",
      "postcss.config.mjs",
    ],
  },
];

export default eslintConfig;
