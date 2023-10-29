import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import getRoadmapInvites from "@/lib/server/api/getRoadmapInvites";
import getNotifications from "@/lib/server/api/getNotifications";
import mockNotifications from "@/__mocks__/notifications";
import { mockRoadmapData } from "@/__mocks__/roadmaps";
import { mockRoadmapInvites } from "@/__mocks__/roadmap-invites";
import RoadmapsLayout from "./layout";

jest.mock("@/lib/server/api/getRoadmapInvites");
jest.mock("@/lib/server/api/getNotifications");

describe("Roadmaps Layout", () => {
  it("Should render successfully", async () => {
    (getRoadmapInvites as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        roadmapInvites: mockRoadmapInvites,
        roadmapData: mockRoadmapData,
      })
    );
    (getNotifications as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        notifications: mockNotifications,
      })
    );
    const Result = await RoadmapsLayout({
      children: <p>Test</p>,
    });
    const { baseElement } = render(Result, { wrapper: AppWrapper });
    expect(baseElement).toBeTruthy();
  });
});
