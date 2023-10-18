import { usePathname } from "next/navigation";
import { render } from "@testing-library/react";
import AddButton from "./add-button";
import { AppWrapper } from "@/__mocks__/wrappers";

jest.mock("next/navigation", () => {
  const originalModule = jest.requireActual("next/navigation");
  return {
    ...originalModule,
    usePathname: jest.fn(() => "/roadmaps"),
  };
});

describe("AddButton", () => {
  it("Should render successfully", () => {
    const { baseElement, getByRole } = render(<AddButton />, {
      wrapper: AppWrapper,
    });
    expect(baseElement).toBeTruthy();
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("Should render null if on page with no wrapper component", () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/login");
    const { baseElement, queryByRole } = render(<AddButton />, {
      wrapper: AppWrapper,
    });
    expect(baseElement).toBeTruthy();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
