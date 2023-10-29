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

jest.mock("@clerk/nextjs/server", () => {
  const originalModule = jest.requireActual("@clerk/nextjs/server");
  return {
    __esModule: true,
    ...originalModule,
    clerkClient: {
      users: {
        getUserList: jest.fn(() => {
          return [
            {
              id: "123",
              firstName: "Test",
              lastName: "Mentee",
            },
          ];
        }),
      },
    },
  };
});
