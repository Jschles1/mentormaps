/**

@jest-environment node */
import { PATCH, DELETE } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prisma-db";

jest.mock("@/lib/prisma-db", () => {
  return {
    __esModule: true,
    default: {
      roadmap: { findFirst: jest.fn(), update: jest.fn() },
      milestone: { update: jest.fn(), findFirst: jest.fn(), delete: jest.fn() },
      notification: { create: jest.fn() },
    },
  };
});

describe("PATCH /api/roadmaps/:roadmapId/milestones/:milestoneId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "" }));
    const req = {} as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if title or description is missing", async () => {
    const req = {
      json: jest.fn(() => {
        return { title: "", description: "" };
      }),
    } as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing title or description");
  });

  it("Should return 401 if user is not authorized to update milestone", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
    });
    const req = {
      json: jest.fn(() => {
        return { title: "Test Milestone", description: "Test Description" };
      }),
    } as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should update milestone and return 200 if mentor approves mentee solution", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
      menteeId: "456",
    });
    (prismadb.milestone.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      order: 1,
      title: "Test Milestone",
      status: "Completed",
      mentorFeedbackComment: "Good job!",
    });
    (prismadb.milestone.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 2,
      order: 2,
      title: "Next Milestone",
      status: "Pending",
    });
    (prismadb.roadmap.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      status: "Completed",
    });
    const req = {
      json: jest.fn(() => {
        return { decision: "approve", mentorFeedbackComment: "Good job!" };
      }),
    } as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message:
        "Your mentor has approved your solution for the Test Milestone milestone! Since it was the last milestone, your roadmap has been set to completed.",
      approved: true,
    });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: { id: 1, roadmapId: 1 },
      data: { status: "Completed", mentorFeedbackComment: "Good job!" },
    });
    expect(prismadb.milestone.findFirst).toHaveBeenCalledWith({
      where: { roadmapId: 1, order: 2 },
    });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { status: "Active" },
    });
    expect(prismadb.roadmap.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "Completed" },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "456",
        message:
          "Your mentor has approved your solution for the Test Milestone milestone! Since it was the last milestone, your roadmap has been set to completed.",
      },
    });
  });

  it("Should update milestone and return 200 if mentor rejects mentee solution", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
      menteeId: "456",
    });
    (prismadb.milestone.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      order: 1,
      title: "Test Milestone",
      status: "Rejected",
      mentorFeedbackComment: "Needs improvement",
    });
    const req = {
      json: jest.fn(() => {
        return {
          decision: "reject",
          mentorFeedbackComment: "Needs improvement",
        };
      }),
    } as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message:
        "Your mentor has rejected your solution for the Test Milestone milestone. Please review their feedback and resubmit your solution.",
      approved: false,
    });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: { id: 1, roadmapId: 1 },
      data: { status: "Rejected", mentorFeedbackComment: "Needs improvement" },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "456",
        message:
          "Your mentor has rejected your solution for the Test Milestone milestone. Please review their feedback and resubmit your solution.",
      },
    });
  });

  it("Should update milestone and return 200 if mentee submits completion", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
      menteeId: "456",
    });
    (prismadb.milestone.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      order: 1,
      title: "Test Milestone",
      status: "PendingCompletionReview",
      menteeSolutionComment: "Test comment",
      menteeSolutionUrl: "https://example.com/solution",
    });
    const req = {
      json: jest.fn(() => {
        return {
          menteeSolutionComment: "Test comment",
          menteeSolutionUrl: "https://example.com/solution",
        };
      }),
    } as unknown as NextRequest;
    const response = await PATCH(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: { id: 1, roadmapId: 1 },
      data: {
        status: "PendingCompletionReview",
        menteeSolutionComment: "Test comment",
        menteeSolutionUrl: "https://example.com/solution",
      },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "123",
        message:
          "Your mentee has submitted a solution for the Test Milestone milestone!",
      },
    });
  });
});

describe("DELETE /api/roadmaps/:roadmapId/milestones/:milestoneId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "" }));
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if milestone ID or roadmap ID is missing", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "", milestoneId: "" },
    });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing milestone ID or roadmap ID");
  });

  it("Should return 401 if user is not authorized to delete milestone", async () => {
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
    });
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if milestone does not exist", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
    });
    (prismadb.milestone.findFirst as jest.Mock).mockResolvedValueOnce(null);
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Milestone does not exist");
  });

  it("Should delete milestone and return 200 if it is the only milestone", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
      menteeId: "456",
      milestones: [
        { id: 1, order: 1, title: "Test Milestone", status: "Active" },
      ],
      status: "Active",
    });
    (prismadb.milestone.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      order: 1,
      title: "Test Milestone",
      status: "Active",
    });
    (prismadb.milestone.delete as jest.Mock).mockResolvedValueOnce({
      id: 1,
      title: "Test Milestone",
    });
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message:
        "Your mentor has deleted the Test Milestone milestone. Since it was the only milestone, the roadmap has been set to pending.",
    });
    expect(prismadb.milestone.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismadb.roadmap.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "Pending" },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "456",
        message:
          "Your mentor has deleted the Test Milestone milestone. Since it was the only milestone, the roadmap has been set to pending.",
      },
    });
  });

  it("Should delete milestone and return 200 if it is not the only milestone", async () => {
    (auth as jest.Mock).mockReturnValueOnce(Promise.resolve({ userId: "123" }));
    (prismadb.roadmap.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      mentorId: "123",
      menteeId: "456",
      milestones: [
        { id: 1, order: 1, title: "Test Milestone", status: "Active" },
        { id: 2, order: 2, title: "Next Milestone", status: "Pending" },
      ],
      status: "Active",
    });
    (prismadb.milestone.findFirst as jest.Mock).mockResolvedValueOnce({
      id: 1,
      order: 1,
      title: "Test Milestone",
      status: "Active",
    });
    (prismadb.milestone.delete as jest.Mock).mockResolvedValueOnce({
      id: 1,
      title: "Test Milestone",
    });
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, {
      params: { roadmapId: "1", milestoneId: "1" },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message:
        "Your mentor has deleted the Test Milestone milestone. The order of the remaining milestones has been updated.",
    });
    expect(prismadb.milestone.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismadb.milestone.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { order: 1, status: "Active" },
    });
    expect(prismadb.notification.create).toHaveBeenCalledWith({
      data: {
        userId: "456",
        message:
          "Your mentor has deleted the Test Milestone milestone. The order of the remaining milestones has been updated.",
      },
    });
  });
});
