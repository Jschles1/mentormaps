import { render, screen, fireEvent } from "@testing-library/react";
import MilestoneCard from "./milestone-card";
import { Milestone } from "@prisma/client";
import { AppWrapper } from "@/__mocks__/wrappers";

describe("MilestoneCard", () => {
  const milestone: Milestone = {
    id: 1,
    title: "Test Milestone",
    description: "This is a test milestone",
    subtasks: ["Subtask 1", "Subtask 2"],
    resources: [
      "Resource 1___***___www.google.com",
      "Resource 2___***___www.google.com",
    ],
    menteeSolutionComment: "",
    menteeSolutionUrl: "",
    status: "Active",
    roadmapId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    attempts: 0,
    completedAt: null,
    expectedCompletionTime: null,
    mentorFeedbackComment: "",
    order: 1,
    startedAt: new Date(),
  };

  it("Renders the milestone title", () => {
    render(<MilestoneCard milestone={milestone} isMentor />, {
      wrapper: AppWrapper,
    });
    const titleElement = screen.getByText(milestone.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("Renders the milestone description", () => {
    render(<MilestoneCard milestone={milestone} isMentor />, {
      wrapper: AppWrapper,
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const descriptionElement = screen.getByText(milestone.description);
    expect(descriptionElement).toBeInTheDocument();
  });

  it("Renders the milestone status", () => {
    render(<MilestoneCard milestone={milestone} isMentor />, {
      wrapper: AppWrapper,
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const statusElement = screen.getByText(milestone.status);
    expect(statusElement).toBeInTheDocument();
  });

  it("Renders the subtasks", () => {
    render(<MilestoneCard milestone={milestone} isMentor />, {
      wrapper: AppWrapper,
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const subtaskElement1 = screen.getByText(milestone.subtasks[0]);
    const subtaskElement2 = screen.getByText(milestone.subtasks[1]);
    expect(subtaskElement1).toBeInTheDocument();
    expect(subtaskElement2).toBeInTheDocument();
  });

  it("Renders the resources", () => {
    render(<MilestoneCard milestone={milestone} isMentor />, {
      wrapper: AppWrapper,
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    const resourceElements = screen.getAllByRole("link");
    expect(resourceElements).toHaveLength(milestone.resources.length);
  });
});
