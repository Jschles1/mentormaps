import { render, screen, within, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoadmapDetailPageTemplate from "./roadmap-detail-page-template";
import { RoadmapWithMilestonesAndInvites } from "@/lib/interfaces";
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === "test" ? () => {} : console.error,
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ClerkProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ClerkProvider>
);

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
      { wrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
