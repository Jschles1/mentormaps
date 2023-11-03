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
      milestone: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    },
  };
});

describe("POST /api/roadmaps/:roadmapId/milestones", () => {
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
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if title or description is missing", async () => {
    const req = {
      json: jest.fn(() => {
        return {
          title: "",
          description: "",
        };
      }),
    } as unknown as NextRequest;
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing title or description");
  });

  it("Should create a new milestone and return 200 if request is valid", async () => {
    const req = {
      json: jest.fn(() => {
        return {
          title: "Test Milestone",
          description: "Test Description",
          resources: [
            { name: "Resource 1", href: "https://example.com/resource1" },
            { name: "Resource 2", href: "https://example.com/resource2" },
          ],
          subtasks: ["Subtask 1", "Subtask 2"],
          menteeId: "456",
        };
      }),
    } as unknown as NextRequest;
    (prismadb.milestone.findMany as jest.Mock).mockResolvedValueOnce([]);
    (prismadb.milestone.create as jest.Mock).mockResolvedValueOnce({
      id: 1,
    });
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
    expect(prismadb.milestone.create).toHaveBeenCalledWith({
      data: {
        title: "Test Milestone",
        description: "Test Description",
        resources: [
          "Resource 1___***___https://example.com/resource1",
          "Resource 2___***___https://example.com/resource2",
        ],
        subtasks: ["Subtask 1", "Subtask 2"],
        order: 1,
        roadmapId: 1,
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "456",
        message: `Your mentor has added a new milestone Test Milestone to your roadmap!`,
      },
    });
  });

  it("Should return 500 if an error occurs", async () => {
    const req = {
      json: jest.fn(() => {
        return {
          title: "Test Milestone",
          description: "Test Description",
        };
      }),
    } as unknown as NextRequest;
    (prismadb.milestone.findMany as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );
    const response = await POST(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
