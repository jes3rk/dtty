import { CONTROLLER_ENDPOINTS_META } from "../constants";
import { ControllerEndpointMetadata } from "../types";

const methodDecorator =
  ({
    method,
    path,
  }: Omit<ControllerEndpointMetadata, "propertyKey">): MethodDecorator =>
  (target, propertyKey) => {
    if (Reflect.hasMetadata(CONTROLLER_ENDPOINTS_META, target)) {
      const existing: ControllerEndpointMetadata[] = Reflect.getMetadata(
        CONTROLLER_ENDPOINTS_META,
        target,
      );
      existing.push({
        method,
        path,
        propertyKey,
      });
    } else {
      Reflect.defineMetadata(
        CONTROLLER_ENDPOINTS_META,
        [{ method: "get", path, propertyKey }],
        target.constructor,
      );
    }
  };

export const Get = (path: string): MethodDecorator =>
  methodDecorator({ path, method: "get" });
