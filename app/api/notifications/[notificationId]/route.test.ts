/**
 * @jest-environment node
 */

import { DELETE } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";
import deleteNotification from "@/lib/server/api/deleteNotification";

jest.mock("@/lib/server/api/deleteNotification");

const params = {
  notificationId: "1",
};

describe("DELETE /api/notifications/:notificationId", () => {
  it("should return 401 if user is not logged in", async () => {
    (auth as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        userId: "",
      })
    );
    const req = {
      params,
    } as unknown as NextRequest;
    const response = await DELETE(req, { params });
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
  });

  it("should return 400 if notificationId is not a number", async () => {
    const req = {
      params,
    } as unknown as NextRequest;
    const response = await DELETE(req, { params: { notificationId: "abc" } });
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Requested notification doesn't exist");
  });

  it("should call deleteNotification with correct arguments and return 200 if request is valid", async () => {
    const req = {
      params,
    } as unknown as NextRequest;
    const response = await DELETE(req, { params });
    expect(deleteNotification).toHaveBeenCalledWith("123", 1);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Success" });
  });

  it("should return 500 if an error occurs", async () => {
    (deleteNotification as jest.Mock).mockRejectedValueOnce(new Error());
    const req = {
      params,
    } as unknown as NextRequest;
    const response = await DELETE(req, { params });
    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Error");
  });
});
