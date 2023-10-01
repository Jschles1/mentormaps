// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
import "@testing-library/jest-dom";

jest.mock("@clerk/nextjs", () => {
  const originalModule = jest.requireActual("@clerk/nextjs");
  return {
    __esModule: true,
    ...originalModule,
    auth: jest.fn(() => {
      return {
        userId: "123",
      };
    }),
  };
});
