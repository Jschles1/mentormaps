import { render, screen } from "@testing-library/react";
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

  it("Should render successfully with no roadmaps", async () => {
    jest.mock("@/lib/server/api/getRoadmaps", () => {
      return jest.fn(() => ({
        mentorRoadmaps: [],
        menteeRoadmaps: [],
      }));
    });
    const Result = await Page();
    render(Result, { wrapper: AppWrapper });

    expect(
      screen.getByText("You currently do not own or belong to any roadmaps.")
    ).toBeInTheDocument();
  });
});
