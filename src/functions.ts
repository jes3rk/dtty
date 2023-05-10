import { constructor } from "tsyringe/dist/typings/types";
import { EXCEPTION_HANDLER_META } from "./constants";
import { ExceptionHandler } from "./interfaces/exception-handler.interface";

export function findBestHandler(
  err: Error,
  endpointExceptionHandlers: constructor<ExceptionHandler>[],
  controllerExceptionHandlers: constructor<ExceptionHandler>[],
): constructor<ExceptionHandler> {
  const errorConstructor = err.constructor as constructor<Error>;
  const matchingEndpointHandler = endpointExceptionHandlers.find((handler) =>
    isMatchingHandler(errorConstructor, handler),
  );
  if (matchingEndpointHandler) return matchingEndpointHandler;

  const genericEndpointHandler = endpointExceptionHandlers.find(
    (handler) =>
      Reflect.getMetadata(EXCEPTION_HANDLER_META, handler) === undefined,
  );
  if (genericEndpointHandler) return genericEndpointHandler;

  const matchingControllerHandler = controllerExceptionHandlers.find(
    (handler) => isMatchingHandler(errorConstructor, handler),
  );
  if (matchingControllerHandler) return matchingControllerHandler;

  const genericControllerHandler = controllerExceptionHandlers.find(
    (handler) =>
      Reflect.getMetadata(EXCEPTION_HANDLER_META, handler) === undefined,
  );
  if (genericControllerHandler) return genericControllerHandler;

  return;
}

function isMatchingHandler(
  err: constructor<Error>,
  handler: constructor<ExceptionHandler>,
): boolean {
  return (
    Reflect.getMetadata(EXCEPTION_HANDLER_META, handler)?.name === err.name
  );
}
