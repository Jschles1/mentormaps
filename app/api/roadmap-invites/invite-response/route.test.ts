/**
 * @jest-environment node
 */

import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";

jest.mock("@/lib/prisma-db", () => {
  return {
    __esModule: true,
    default: {
      roadmap: {
        update: jest.fn(),
      },
      roadmapInvite: {
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    },
  };
});

describe("POST /api/roadmap-invites/invite-response", () => {
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

  it("Should return 400 if roadmapInvite doesn't exist", async () => {
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce(null);
    const req = {
      json: jest.fn(() => {
        return {
          accepted: true,
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Roadmap invite doesn't exist");
  });

  it("Should update roadmap and create notification if accepted is true", async () => {
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce({
      id: 1,
      roadmapId: "1",
      menteeId: "456",
      mentorId: "789",
      menteeName: "Test Mentee",
    });
    const req = {
      json: jest.fn(() => {
        return {
          accepted: true,
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      accepted: true,
      roadmapId: "1",
    });
    expect(prismadb.roadmap.update).toHaveBeenCalledWith({
      where: {
        id: "1",
      },
      data: {
        menteeId: "123",
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "789",
        message: "Test Mentee has accepted your roadmap invite!",
      },
    });
    expect(prismadb.roadmapInvite.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });

  it("Should delete roadmapInvite if accepted is false", async () => {
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockReturnValueOnce({
      id: 1,
      roadmapId: "1",
      menteeId: "456",
      mentorId: "789",
      menteeName: "Test Mentee",
    });
    const req = {
      json: jest.fn(() => {
        return {
          accepted: false,
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      accepted: false,
      roadmapId: "1",
    });
    expect(prismadb.roadmapInvite.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });

  it("should return 500 if an error occurs", async () => {
    (prismadb.roadmapInvite.findFirst as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    const req = {
      json: jest.fn(() => {
        return {
          accepted: true,
          roadmapId: "1",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
