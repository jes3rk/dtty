import { CONTROLLER_PARAM_META, ControllerParams } from "../constants";
import { ControllerParamMeta } from "../types";
import { SetMetadata } from "./set-metadata.decorator";

const setControllerParam =
  (param: ControllerParamMeta): ParameterDecorator =>
  (target, propertyKey) => {
    const existingMetadata: ControllerParamMeta[] =
      Reflect.getMetadata(CONTROLLER_PARAM_META, target[propertyKey]) || [];
    SetMetadata(CONTROLLER_PARAM_META, [param].concat(existingMetadata))(
      target,
      propertyKey,
      { value: target[propertyKey] },
    );
  };

/**
 * Inject the parsed and formatted request body
 */
export const Body = (): ParameterDecorator =>
  setControllerParam({ type: ControllerParams.BODY });
export const Param = (paramName?: string) =>
  setControllerParam({ type: ControllerParams.PARAM, paramName });
export const Request = (): ParameterDecorator =>
  setControllerParam({ type: ControllerParams.REQUEST });
