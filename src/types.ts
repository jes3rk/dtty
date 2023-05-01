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
