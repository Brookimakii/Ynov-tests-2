import * as validators from "../../utils/validators";

describe("validators index exports", () => {
  test("exports the expected functions and classes", () => {
    expect(typeof validators.validateAge).toBe("function");
    expect(typeof validators.validateEmail).toBe("function");
    expect(typeof validators.validateIdentity).toBe("function");
    expect(typeof validators.validatePostalCode).toBe("function");
    expect(typeof validators.validateUser).toBe("function");
    expect(typeof validators.ValidationError).toBe("function");
  });
});
