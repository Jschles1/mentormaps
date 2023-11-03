import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockMentorRoadmaps, mockMenteeRoadmaps } from "@/__mocks__/roadmaps";
import Page from "./page";
import getRoadmaps from "@/lib/server/api/getRoadmaps";
import { testQueryClient } from "@/__mocks__/wrappers";

jest.mock("@/lib/server/api/getRoadmaps");

describe("Roadmaps Page", () => {
  beforeEach(() => {
    testQueryClient.clear();
  });

  afterEach(() => {
    // jest.restoreAllMocks(); // Restore all mocks back to their original implementations
  });

  it("Should render successfully", async () => {
    (getRoadmaps as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        menteeRoadmaps: mockMenteeRoadmaps,
        mentorRoadmaps: mockMentorRoadmaps,
      })
    );
    const Result = await Page();
    render(Result, { wrapper: AppWrapper });
    expect(screen.getByText("Mentor Roadmaps (2)")).toBeInTheDocument();
  });

  it("Should render successfully with no roadmaps", async () => {
    (getRoadmaps as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        menteeRoadmaps: [],
        mentorRoadmaps: [],
      })
    );
    const Result = await Page();
    render(Result, { wrapper: AppWrapper });
    expect(
      screen.getByText("You currently do not own or belong to any roadmaps.")
    ).toBeInTheDocument();
  });
});
