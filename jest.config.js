const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig = {
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@/(.*)$": "<rootDir>/$1",

    "^@/public/(.*)$": "<rootDir>/public/$1",

    "^__mocks__/(.*)$": "<rootDir>/__mocks__/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "!./**/_*.{js,jsx,ts,tsx}",
    "!./**/*.stories.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/loading.tsx",
    "!**/error.tsx",
    "!<rootDir>/jest.config.js",
    "!<rootDir>/middleware.ts",
    "!<rootDir>/next.config.js",
    "!<rootDir>/postcss.config.js",
    "!<rootDir>/tailwind.config.ts",
    "!<rootDir>/app/layout.tsx",
    "!<rootDir>/app/query-providers.tsx",
    "!**/node_modules/**",
    "!./components/ui/**",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
