import Container from "typedi";
import { CONTROLLER_ENDPOINTS_META } from "../constants";
import { ROUTER_TOKEN } from "../tokens";
import { ControllerEndpointMetadata } from "../types";

/**
 * Mark a class as the controller for a given path
 */
export const Controller =
  (path?: string): ClassDecorator =>
  (target) => {
    if (!path) return;
    const router = Container.get(ROUTER_TOKEN);
    const endpoints: ControllerEndpointMetadata[] = Reflect.getMetadata(
      CONTROLLER_ENDPOINTS_META,
      target,
    );
    endpoints.forEach((e) => {
      router[e.method](path + e.path.replace(/^\//, ""), async (req) => {
        const controller = Container.get(target);
        return controller[e.propertyKey](req);
      });
    });
  };
