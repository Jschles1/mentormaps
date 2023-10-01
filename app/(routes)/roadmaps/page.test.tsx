import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockMentorRoadmaps, mockMenteeRoadmaps } from "@/__mocks__/roadmaps";
import Page from "./page";

describe("Roadmaps Page", () => {
  it("Should render successfully", async () => {
    jest.mock("@/lib/server/api/getRoadmaps", () => {
      return jest.fn(() => ({
        mentorRoadmaps: mockMentorRoadmaps,
        menteeRoadmaps: mockMenteeRoadmaps,
      }));
    });
    const Result = await Page();
    const { baseElement } = render(Result, { wrapper: AppWrapper });
    expect(baseElement).toBeTruthy();
  });
});
