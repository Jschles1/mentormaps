import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockMenteeRoadmaps, mockMentorRoadmaps } from "@/__mocks__/roadmaps";
import RoadmapsPageTemplate from "./roadmaps-page-template";

describe("Roadmap Detail Page Template", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(
      <RoadmapsPageTemplate
        mentorRoadmaps={mockMentorRoadmaps}
        menteeRoadmaps={mockMenteeRoadmaps}
        userId="1"
      />,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
