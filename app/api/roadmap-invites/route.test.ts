/**
 * @jest-environment node
 */

import { GET } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";
import { mockRoadmapInvites } from "@/__mocks__/roadmap-invites";

jest.mock("@/lib/server/api/getRoadmapInvites");

describe("GET /api/roadmap-invites", () => {
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

  it("Should retrieve roadmap invites and return 200 if request is valid", async () => {
    (getRoadmapInvites as jest.Mock).mockReturnValueOnce(
      Promise.resolve(mockRoadmapInvites)
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe(JSON.stringify(mockRoadmapInvites));
  });

  it("should return 500 if an error occurs", async () => {
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
