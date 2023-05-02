import { ControllerParams } from "./constants";
import { ControllerParamMeta, IttyRequest } from "./types";

export class ParamMapper {
  constructor(private readonly request: IttyRequest) {}

  private handleRequest(): IttyRequest {
    return this.request;
  }

  private handleParam(
    meta: ControllerParamMeta,
  ): undefined | string | Record<string, unknown> {
    if (meta.type !== ControllerParams.PARAM) return undefined;
    if (meta.paramName) return this.request.params[meta.paramName];
    return this.request.params;
  }

  public mapTo(metadata: ControllerParamMeta[]): unknown[] {
    return metadata.map((meta) => {
      switch (meta.type) {
        case ControllerParams.PARAM:
          return this.handleParam(meta);
        case ControllerParams.REQUEST:
          return this.handleRequest();
        default:
          throw new Error("Invalid Param Type");
      }
    });
  }
}
