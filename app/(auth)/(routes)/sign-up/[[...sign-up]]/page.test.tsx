import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import Page from "./page";

describe("Sign Up Page", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(<Page />, { wrapper: AppWrapper });
    expect(baseElement).toBeTruthy();
  });
});
