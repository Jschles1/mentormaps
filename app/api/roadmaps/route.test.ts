/**
 * @jest-environment node
 */

import { GET } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import getRoadmaps from "@/lib/server/api/getRoadmaps";
import { mockMenteeRoadmaps, mockMentorRoadmaps } from "@/__mocks__/roadmaps";

jest.mock("@/lib/server/api/getRoadmaps");

describe("GET /api/roadmaps", () => {
  it("Should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("Should retrieve roadmaps and return 200 if request is valid", async () => {
    (getRoadmaps as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        menteeRoadmaps: mockMenteeRoadmaps,
        mentorRoadmaps: mockMentorRoadmaps,
      })
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(await (json as any).menteeRoadmaps.length).toBe(2);
    expect(await (json as any).mentorRoadmaps.length).toBe(2);
  });

  it("Should return 500 if an error occurs", async () => {
    (getRoadmaps as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
