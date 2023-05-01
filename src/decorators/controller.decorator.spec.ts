import { CONTROLLER_META } from "../constants";
import { Controller } from "./controller.decorator";

describe("Controller decorator", () => {
  it("will add the controller metadata", () => {
    @Controller("/test")
    class TestController {}

    expect(Reflect.getMetadata(CONTROLLER_META, TestController)).toEqual(
      "/test",
    );
  });
});
