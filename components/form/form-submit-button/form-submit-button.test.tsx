import { render, screen, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import FormSubmitButton from "./form-submit-button";

describe("FormSubmitButton", () => {
  it("Renders the button with the correct text", () => {
    render(<FormSubmitButton isLoading={false}>Submit</FormSubmitButton>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  it("Disables the button when isLoading is true", () => {
    render(<FormSubmitButton isLoading>Submit</FormSubmitButton>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("Calls the onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <FormSubmitButton onClick={handleClick} isLoading={false}>
        Submit
      </FormSubmitButton>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
