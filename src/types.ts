export interface ControllerEndpointMetadata {
  path: string;
  propertyKey: string | symbol;
  method: "get" | "post" | "put" | "delete";
}
