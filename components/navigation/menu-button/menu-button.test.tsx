import { render } from "@testing-library/react";
import MenuButton from "./menu-button";

describe("MenuButton", () => {
  it("renders the button with the correct text", () => {
    const { getByRole } = render(<MenuButton>Test</MenuButton>);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
