/**
 * @jest-environment node
 */

import { POST } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";
import { clerkClient } from "@clerk/nextjs/server";
import { mockRoadmapInvites } from "@/__mocks__/roadmap-invites";
import { mockMentor } from "@/__mocks__/users";

// jest.mock("@clerk/nextjs", () => {
//   const originalModule = jest.requireActual("@clerk/nextjs");
//   return {
//     __esModule: true,
//     ...originalModule,
//     auth: jest.fn(() => {
//       return {
//         userId: "123",
//       };
//     }),
//   };
// });

// jest.mock("@clerk/nextjs/server", () => {
//   const originalModule = jest.requireActual("@clerk/nextjs/server");
//   return {
//     __esModule: true,
//     ...originalModule,
//     clerkClient: {
//       users: {
//         getUserList: jest.fn(() => {
//           return [
//             {
//               id: "456",
//               firstName: "Test",
//               lastName: "Mentee",
//             },
//           ];
//         }),
//       },
//     },
//   };
// });

// jest.mock("@clerk/nextjs/server", () => {
//   const originalModule = jest.requireActual("@clerk/nextjs/server");
//   return {
//     __esModule: true,
//     ...originalModule,
//     clerkClient: {
//       users: {
//         getUserList: jest.fn(() => {
//           return [
//             {
//               id: "123",
//               firstName: "Test",
//               lastName: "Mentee",
//             },
//           ];
//         }),
//       },
//     },
//   };
// });

jest.mock("@/lib/prisma-db", () => {
  return {
    __esModule: true,
    default: {
      roadmapInvite: {
        findFirst: jest.fn(() => {
          return mockRoadmapInvites[0];
        }),
        create: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    },
  };
});

describe("POST /api/roadmap-invites/send-invite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if menteeEmail or roadmapId is missing", async () => {
    const req = {
      json: jest.fn(() => {
        return {
          menteeEmail: "",
          roadmapId: "",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing menteeEmail or roadmapId");
  });

  it("Should return 400 if mentee email doesn't exist", async () => {
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValue([]);
    const req = {
      json: jest.fn(() => {
        return {
          menteeEmail: "test@example.com",
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Mentee email doesn't exist");
  });

  it("Should return 400 if mentee has already been invited", async () => {
    const mockUsers = [
      { id: "test-mentee-id", firstName: "Test", lastName: "Mentee" },
    ];
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValueOnce(
      mockUsers
    );
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce({
      id: 1,
    });
    const req = {
      json: jest.fn(() => {
        return {
          menteeEmail: "test123@example.com",
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Mentee has already been invited");
  });

  it("Should create roadmap invite and notification if mentee exists and hasn't been invited", async () => {
    const mockUsers = [
      { id: "test-mentee-id", firstName: "Test", lastName: "Mentee" },
    ];
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValueOnce(
      mockUsers
    );
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce(null);
    (prismadb.roadmapInvite.create as jest.Mock).mockResolvedValue({
      id: "test-invite-id",
    });
    (prismadb.notification.create as jest.Mock).mockResolvedValue({
      id: "test-notification-id",
    });
    const req = {
      json: jest.fn(() => {
        return {
          menteeEmail: "test@example.com",
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
    expect(prismadb.roadmapInvite.create).toHaveBeenCalledWith({
      data: {
        roadmapId: 1,
        mentorId: "123",
        menteeName: "Test Mentee",
        menteeId: "test-mentee-id",
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "test-mentee-id",
        message: `You've been invited to a new roadmap!`,
      },
    });
  });

  it("should return 500 if an error occurs", async () => {
    const mockUsers = [
      { id: "test-mentee-id", firstName: "Test", lastName: "Mentee" },
    ];
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValueOnce(
      mockUsers
    );
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce(null);
    (prismadb.roadmapInvite.create as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    const req = {
      json: jest.fn(() => {
        return {
          menteeEmail: "test500@example.com",
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
