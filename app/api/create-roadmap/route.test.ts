/**
 * @jest-environment node
 */

import { POST } from "./route";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prismadb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";

jest.mock("@/lib/prisma-db", () => ({
  __esModule: true,
  default: {
    roadmap: {
      create: jest.fn(),
    },
    roadmapInvite: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}));

describe("POST /api/create-roadmap", () => {
  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({ title: "Test Roadmap", goal: "Test Goal" }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if title or goal is missing", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ title: "", goal: "Test Goal" }),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing title or goal");
  });

  it("Should return 400 if mentee email doesn't exist", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        title: "Test Roadmap",
        goal: "Test Goal",
        menteeEmail: "nonexistent@example.com",
      }),
    } as unknown as NextRequest;
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValue([]);
    const response = await POST(req);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Mentee email doesn't exist");
  });

  it("Should create a new roadmap and return 200 if request is valid", async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        title: "Test Roadmap",
        goal: "Test Goal",
        menteeEmail: "test@example.com",
      }),
    } as unknown as NextRequest;
    (clerkClient.users.getUserList as jest.Mock).mockResolvedValue([
      { id: "test-mentee-id", firstName: "Test", lastName: "Mentee" },
    ]);
    (prismadb.roadmap.create as jest.Mock).mockResolvedValue({
      id: "test-roadmap-id",
    });
    (prismadb.roadmapInvite.create as jest.Mock).mockResolvedValue({
      id: "test-invite-id",
    });
    (prismadb.notification.create as jest.Mock).mockResolvedValue({
      id: "test-notification-id",
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
    expect(prismadb.roadmap.create).toHaveBeenCalledWith({
      data: {
        title: "Test Roadmap",
        goal: "Test Goal",
        mentorId: expect.any(String),
      },
    });
    expect(prismadb.roadmapInvite.create).toHaveBeenCalledWith({
      data: {
        roadmapId: "test-roadmap-id",
        mentorId: expect.any(String),
        menteeId: "test-mentee-id",
        menteeName: "Test Mentee",
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "test-mentee-id",
        message: "You've been invited to a new roadmap named Test Roadmap!",
      },
    });
  });

  it("should return 500 if an error occurs", async () => {
    const req = {
      json: jest.fn().mockRejectedValue(new Error("Test Error")),
    } as unknown as NextRequest;
    const response = await POST(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
