import { CONTROLLER_ENDPOINTS_META } from "../constants";
import { ControllerEndpointMetadata } from "../types";
import { Controller } from "./controller.decorator";
import { Delete, Get, Post, Put } from "./method.decorator";

describe("Method decorators", () => {
  @Controller("/test")
  /* eslint-disable @typescript-eslint/no-empty-function  */
  class TestController {
    @Get("/")
    public handleGet() {}

    @Post("/")
    public handlePost() {}

    @Put("/")
    public handlePut() {}

    @Delete("/")
    public handleDelete() {}
  }

  it("will setup the bare minimum metadata", () => {
    const endpointMeta: ControllerEndpointMetadata[] = Reflect.getMetadata(
      CONTROLLER_ENDPOINTS_META,
      TestController,
    );
    expect(endpointMeta).toBeDefined();
    expect(endpointMeta).toHaveLength(4);
  });

  it.each(["Get", "Post", "Put", "Delete"])(
    "will set the correct metadata for %s",
    (method: string) => {
      const endpointMeta: ControllerEndpointMetadata[] = Reflect.getMetadata(
        CONTROLLER_ENDPOINTS_META,
        TestController,
      )?.filter(
        (meta: ControllerEndpointMetadata) =>
          meta.method === method.toLowerCase(),
      );
      expect(endpointMeta).toBeDefined();
      expect(endpointMeta).toHaveLength(1);

      expect(Object.keys(endpointMeta[0])).toHaveLength(3);
      expect(endpointMeta[0].propertyKey).toEqual(`handle${method}`);
    },
  );
});
