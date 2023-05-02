import { APPLY_MIDDLEWARE_META } from "src/constants";
import { constructor } from "tsyringe/dist/typings/types";
import { DittyMiddleware } from "../interfaces/middleware.interface";
import { SetMetadata } from "./set-metadata.decorator";

/**
 * Add middleware to either a controller or endpoint with full
 * dependency injection support.
 */
export const ApplyMiddleware = (
  ...middleware: constructor<DittyMiddleware>[]
) => SetMetadata(APPLY_MIDDLEWARE_META, middleware);
