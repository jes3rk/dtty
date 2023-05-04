export const APPLY_MIDDLEWARE_META = "__apply-middleware__";
export const CONTROLLER_ENDPOINTS_META = "__controller-endpoints-meta__";
export const CONTROLLER_META = "__controller-meta__";
export const CONTROLLER_PARAM_META = "__controller-params__";
export const BODY_TYPE = "__body-type__";

export enum ControllerMethod {
  delete = "delete",
  get = "get",
  post = "post",
  put = "put",
}

export enum ControllerParams {
  BODY = "BODY",
  PARAM = "PARAM",
  REQUEST = "REQUEST",
}

export enum Scope {
  /**
   * Only maintain one instance of a given
   * dependency in the application
   */
  Singleton = "singleton",
  /**
   * Create a new instance of the dependency
   * each time it is requested
   */
  Transient = "transient",
}
