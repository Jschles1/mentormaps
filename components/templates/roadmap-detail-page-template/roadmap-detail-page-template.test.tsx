import { render } from "@testing-library/react";
import RoadmapDetailPageTemplate from "./roadmap-detail-page-template";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockMentor, mockMentee } from "@/__mocks__/users";
import { mockRoadmap } from "@/__mocks__/roadmaps";

describe("Roadmap Detail Page Template", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(
      <RoadmapDetailPageTemplate
        roadmap={mockRoadmap}
        roadmapId={mockRoadmap.id}
        isMentor
        otherUser={mockMentee}
        currentUser={mockMentor}
      />,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
