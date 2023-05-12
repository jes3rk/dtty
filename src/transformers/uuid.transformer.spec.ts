import { v4 } from "uuid";
import { ValidationException } from "../exceptions/validation.exception";
import { UuidTransformer } from "./uuid.transformer";

describe("UuidTransformer", () => {
  let transformer: UuidTransformer;

  beforeEach(() => {
    transformer = new UuidTransformer();
  });

  it("will pass a valid uuid", () => {
    const uuid = v4();
    expect(transformer.transform(uuid)).toEqual(uuid);
  });

  it("will reject an invalid string", () => {
    const notUuid = "helloworld";
    expect(() => transformer.transform(notUuid)).toThrowError(
      ValidationException,
    );
  });

  it("will reject a number", () => {
    const notUuid = 1;
    expect(() => transformer.transform(notUuid)).toThrowError(
      ValidationException,
    );
  });
});
