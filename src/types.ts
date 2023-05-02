import { IRequest } from "itty-router";
import { ControllerMethod } from "./constants";

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
