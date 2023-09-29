import { render } from "@testing-library/react";
import RoadmapDetailPageTemplate from "./roadmap-detail-page-template";
import { RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";
import { AppWrapper } from "@/__mocks__/wrappers";

const testRoadmap: RoadmapWithMilestonesAndInvites = {
  id: 1,
  title: "Software Developer Roadmap",
  goal: "Become a Software Developer",
  status: "Pending",
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  completedAt: new Date(),
  mentorId: "1",
  menteeId: "2",
  currentMilestoneId: null,
  milestonesCompleted: null,
  milestonesTotal: null,
  milestones: [],
  RoadmapInvite: [],
};

const testMentorUser = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@email.com",
};

const testMenteeUser = {
  id: "2",
  firstName: "Jane",
  lastName: "Doe",
  email: "janedoe@email.com",
};

describe("Roadmap Detail Page Template", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(
      <RoadmapDetailPageTemplate
        roadmap={testRoadmap}
        roadmapId={testRoadmap.id}
        isMentor
        otherUser={testMenteeUser}
        currentUser={testMentorUser}
      />,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
