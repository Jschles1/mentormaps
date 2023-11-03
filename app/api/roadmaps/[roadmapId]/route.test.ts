/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import getRoadmapDetails from "@/lib/server/api/getRoadmapDetails";
import updateRoadmap from "@/lib/server/api/updateRoadmap";
import deleteRoadmap from "@/lib/server/api/deleteRoadmap";
import { mockMentorRoadmapDetails } from "@/__mocks__/roadmaps";

jest.mock("@/lib/server/api/getRoadmapDetails");
jest.mock("@/lib/server/api/updateRoadmap");
jest.mock("@/lib/server/api/deleteRoadmap");

describe("GET /api/roadmaps/:roadmapId", () => {
  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should retrieve roadmap details and return 200 if request is valid", async () => {
    (getRoadmapDetails as jest.Mock).mockReturnValueOnce(
      Promise.resolve(mockMentorRoadmapDetails)
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe(
      JSON.stringify(mockMentorRoadmapDetails)
    );
  });

  it("should return 500 if an error occurs", async () => {
    (getRoadmapDetails as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    const req = {} as unknown as NextRequest;
    const response = await GET(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});

describe("PATCH /api/roadmaps/:roadmapId", () => {
  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await PATCH(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if title or goal is missing", async () => {
    const req = {
      json: jest.fn().mockReturnValueOnce({}),
    } as unknown as NextRequest;
    const response = await PATCH(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing title or goal");
  });

  it("Should update roadmap and return 200 if request is valid", async () => {
    const req = {
      json: jest.fn().mockReturnValueOnce({
        title: "New Title",
        goal: "New Goal",
      }),
    } as unknown as NextRequest;
    (updateRoadmap as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        title: "New Title",
        goal: "New Goal",
        menteeId: "2",
      })
    );
    const response = await PATCH(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
  });

  it("should return 500 if an error occurs", async () => {
    const req = {
      json: jest.fn().mockReturnValueOnce({
        title: "New Title",
        goal: "New Goal",
      }),
    } as unknown as NextRequest;
    (updateRoadmap as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await PATCH(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});

describe("DELETE /api/roadmaps/:roadmapId", () => {
  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should return 400 if roadmapId is not a number", async () => {
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, { params: { roadmapId: "abc" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Requested roadmap doesn't exist");
  });

  it("Should delete roadmap and return 200 if request is valid", async () => {
    (deleteRoadmap as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        title: "Deleted Title",
        menteeId: "2",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
  });

  it("should return 500 if an error occurs", async () => {
    (deleteRoadmap as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    const req = {} as unknown as NextRequest;
    const response = await DELETE(req, { params: { roadmapId: "1" } });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
