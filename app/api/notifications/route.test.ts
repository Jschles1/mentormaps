/**
 * @jest-environment node
 */

import { GET } from "./route";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prismadb from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import getNotifications from "@/lib/server/api/getNotifications";
import mockNotifications from "@/__mocks__/notifications";

jest.mock("@/lib/server/api/getNotifications");

describe("GET /api/create-roadmap", () => {
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

  it("Should retrieve notifications and return 200 if request is valid", async () => {
    (getNotifications as jest.Mock).mockReturnValueOnce(
      Promise.resolve(mockNotifications)
    );
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe(JSON.stringify(mockNotifications));
  });

  it("should return 500 if an error occurs", async () => {
    const req = {} as unknown as NextRequest;
    const response = await GET(req);
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
