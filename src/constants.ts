export const APPLY_MIDDLEWARE_META = "__apply-middleware__";
export const CONTROLLER_ENDPOINTS_META = "__controller-endpoints-meta__";
export const CONTROLLER_META = "__controller-meta__";

export enum ControllerMethod {
  delete = "delete",
  get = "get",
  post = "post",
  put = "put",
}

export enum Scope {
  Singleton = "singleton",
  Transient = "transient",
}
