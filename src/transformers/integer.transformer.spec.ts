import { ValidationException } from "../exceptions/validation.exception";
import { IntegerTransformer } from "./integer.transformer";

describe("IntegerTransformer", () => {
  let transformer: IntegerTransformer;

  beforeEach(() => {
    transformer = new IntegerTransformer();
  });

  it("will pass with a string integer", () => {
    const num = 234;

    expect(transformer.transform(num.toString())).toEqual(num);
  });

  it("will throw an error for a non-integer string", () => {
    const str = "hello world";

    expect(() => transformer.transform(str)).toThrowError(ValidationException);
  });
});
