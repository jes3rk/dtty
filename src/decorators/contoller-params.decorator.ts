import { constructor } from "tsyringe/dist/typings/types";
import {
  BODY_TYPE,
  CONTROLLER_PARAM_META,
  ControllerParams,
} from "../constants";
import { DttyTransformer } from "../interfaces/transformer.interface";
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
export const Body =
  (bodyType: constructor<unknown> = Object): ParameterDecorator =>
  (target, propertyKey, index) => {
    setControllerParam({ type: ControllerParams.BODY, bodyType })(
      target,
      propertyKey,
      index,
    );
    SetMetadata(BODY_TYPE, bodyType)(target.constructor.prototype[propertyKey]);
  };
export const Param = (
  paramName?: string,
  transformer?: constructor<DttyTransformer<unknown>>,
) =>
  setControllerParam({ type: ControllerParams.PARAM, paramName, transformer });
export const Request = (): ParameterDecorator =>
  setControllerParam({ type: ControllerParams.REQUEST });
