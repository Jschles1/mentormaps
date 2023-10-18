import React from "react";
import { render } from "@testing-library/react";
import RoadmapCard from "./roadmap-card";
import { mockRoadmap } from "@/__mocks__/roadmaps";

describe("Roadmap Card", () => {
  it("Should render successfully with roadmap name and milestones completed", () => {
    const { getByText, baseElement } = render(
      <RoadmapCard roadmap={mockRoadmap} />
    );
    expect(baseElement).toBeTruthy();
    expect(getByText("Software Developer Roadmap")).toBeInTheDocument();
    expect(getByText("0 of 0 milestones completed")).toBeInTheDocument();
  });
});
