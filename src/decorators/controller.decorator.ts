import { CONTROLLER_META } from "../constants";

/**
 * Mark a class as the controller for a given path
 */
export const Controller =
  (path?: string): ClassDecorator =>
  (target) => {
    Reflect.defineMetadata(CONTROLLER_META, path, target.constructor);
  };
