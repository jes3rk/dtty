import { singleton } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { CONTROLLER_META } from "../constants";

/**
 * Mark a class as the controller for a given path
 */
export const Controller = (path?: string) => (target: constructor<unknown>) => {
  Reflect.defineMetadata(CONTROLLER_META, path, target);
  singleton()(target);
};
