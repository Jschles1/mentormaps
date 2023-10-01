import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import AuthLayout from "./layout";

describe("Auth Layout", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(
      <AuthLayout>
        <p>Test</p>
      </AuthLayout>,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
