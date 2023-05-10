import { constructor } from "tsyringe/dist/typings/types";
import { EXCEPTION_HANDLER_META } from "../constants";
import { Injectable } from "./injectable.decorator";
import { SetMetadata } from "./set-metadata.decorator";

/**
 * Mark a class as an exception handler and optionally add a specific exception type
 * to filter for.
 */
export const HandleException =
  (exception?: constructor<Error>) => (target: constructor<unknown>) => {
    SetMetadata(EXCEPTION_HANDLER_META, exception)(target);
    Injectable()(target);
  };
