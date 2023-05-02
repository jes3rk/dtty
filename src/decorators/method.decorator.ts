import { CONTROLLER_ENDPOINTS_META, ControllerMethod } from "../constants";
import { ControllerEndpointMetadata } from "../types";

const methodDecorator =
  ({
    method,
    path,
  }: Omit<ControllerEndpointMetadata, "propertyKey">): MethodDecorator =>
  (target, propertyKey) => {
    if (Reflect.hasMetadata(CONTROLLER_ENDPOINTS_META, target.constructor)) {
      const existing: ControllerEndpointMetadata[] = Reflect.getMetadata(
        CONTROLLER_ENDPOINTS_META,
        target.constructor,
      );
      Reflect.defineMetadata(
        CONTROLLER_ENDPOINTS_META,
        existing.concat({ method, path, propertyKey }),
        target.constructor,
      );
    } else {
      Reflect.defineMetadata(
        CONTROLLER_ENDPOINTS_META,
        [{ method: "get", path, propertyKey }],
        target.constructor,
      );
    }
  };

export const Delete = (path: string): MethodDecorator =>
  methodDecorator({ path, method: ControllerMethod.delete });

export const Get = (path: string): MethodDecorator =>
  methodDecorator({ path, method: ControllerMethod.get });

export const Post = (path: string): MethodDecorator =>
  methodDecorator({ path, method: ControllerMethod.post });

export const Put = (path: string): MethodDecorator =>
  methodDecorator({ path, method: ControllerMethod.put });
