import { render } from "@testing-library/react";
import { AppWrapper } from "@/__mocks__/wrappers";
import LandingLayout from "./layout";

describe("Landing Layout", () => {
  it("Should render successfully", () => {
    const { baseElement } = render(
      <LandingLayout>
        <p>Test</p>
      </LandingLayout>,
      { wrapper: AppWrapper }
    );
    expect(baseElement).toBeTruthy();
  });
});
