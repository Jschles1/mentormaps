import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import { mockMentorRoadmaps } from "@/__mocks__/roadmaps";
import RoadmapList from "./roadmap-list";

describe("Roadmap List", () => {
  it("Should render successfully", async () => {
    const { baseElement } = render(
      <RoadmapList type="mentor" roadmaps={mockMentorRoadmaps} />,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });

  it("Should render no mentee roadmaps if user is mentee and no roadmaps exist", async () => {
    render(<RoadmapList type="mentee" roadmaps={[]} />, {
      wrapper: AppWrapper,
    });
    expect(screen.getByText("Mentee Roadmaps (0)")).toBeInTheDocument();
  });

  it("Should render no mentor roadmaps if user is mentor and no roadmaps exist", async () => {
    render(<RoadmapList type="mentor" roadmaps={[]} />, {
      wrapper: AppWrapper,
    });
    expect(screen.getByText("Mentor Roadmaps (0)")).toBeInTheDocument();
  });
});
