import { IRequest } from "itty-router";
import { ControllerMethod, ControllerParams } from "./constants";

export interface ControllerEndpointMetadata {
  path: string;
  propertyKey: string | symbol;
  method: ControllerMethod;
}

export type IttyRequest = IRequest & Request;

export interface RouterResponse<T = any> {
  data: T;
  status: number;
}

export type ControllerParamMeta =
  | {
      type: ControllerParams.BODY;
    }
  | {
      type: ControllerParams.PARAM;
      paramName?: string;
    }
  | {
      type: ControllerParams.REQUEST;
    };
