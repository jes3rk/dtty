import { Constructable } from "typedi";

export interface ControllerEndpointMetadata {
  path: string;
  propertyKey: string | symbol;
  method: ControllerMethod;
}

export enum ControllerMethod {
  delete = "delete",
  get = "get",
  post = "post",
  put = "put",
}

export interface ContainerRef {
  get<T>(token: Constructable<T>): T;
  getServices(): any[];
}

export interface RouterResponse<T = any> {
  data: T;
  status: number;
}
