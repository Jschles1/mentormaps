import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockRoadmap } from "@/__mocks__/roadmaps";
import { mockMentor, mockMentee } from "@/__mocks__/users";
import Page from "./page";

const props = {
  params: {
    roadmapId: "1",
  },
};

jest.mock("@/lib/server/api/getRoadmapDetails", () => {
  return jest.fn(() => ({
    roadmap: mockRoadmap,
    isMentor: true,
    currentUser: mockMentor,
    otherUser: mockMentee,
  }));
});

describe("Roadmap Detail Page", () => {
  it("Should render successfully", async () => {
    const Result = await Page(props);
    const { baseElement } = render(Result, { wrapper: AppWrapper });
    expect(baseElement).toBeTruthy();
  });
});
