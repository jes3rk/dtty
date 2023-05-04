import { plainToInstance } from "class-transformer";
import { RouteHandler } from "itty-router";
import { BODY_TYPE, ControllerMethod } from "../constants";
import { DittyRequest } from "../types";

export const transformerMiddlewareFactory =
  (endpointHandler: (...args: unknown[]) => unknown): RouteHandler =>
  async (req: DittyRequest) => {
    if (
      req.method.toLowerCase() === ControllerMethod.get ||
      req.method.toLowerCase() === ControllerMethod.delete
    )
      return;
    const body = await req.json();

    const Constructor =
      Reflect.getMetadata(BODY_TYPE, endpointHandler) || Object;
    req._internalTransformedBody = plainToInstance(Constructor, body);
  };
