import { constructor } from "tsyringe/dist/typings/types";
import { APPLY_HANDLER_META } from "../constants";
import { ExceptionHandler } from "../interfaces/exception-handler.interface";
import { SetMetadata } from "./set-metadata.decorator";

/**
 * Add middleware to either a controller or endpoint with full
 * dependency injection support.
 */
export const ApplyHandlers = (...handlers: constructor<ExceptionHandler>[]) =>
  SetMetadata(APPLY_HANDLER_META, handlers);
