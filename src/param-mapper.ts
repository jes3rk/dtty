import { DependencyContainer } from "tsyringe";
import { ControllerParams } from "./constants";
import { ControllerParamMeta, DttyRequest } from "./types";

export class ParamMapper {
  constructor(
    private readonly request: DttyRequest,
    private readonly container: DependencyContainer,
  ) {}

  private handleRequest(): DttyRequest {
    return this.request;
  }

  private handleParam(
    meta: ControllerParamMeta,
  ): undefined | string | number | Record<string, unknown> | unknown {
    if (meta.type !== ControllerParams.PARAM) return undefined;
    if (meta.paramName) {
      const param = this.request.params[meta.paramName];
      return meta.transformer
        ? this.container.resolve(meta.transformer).transform(param)
        : param;
    }
    return this.request.params;
  }

  public mapTo(metadata: ControllerParamMeta[]): unknown[] {
    return metadata.map((meta) => {
      switch (meta.type) {
        case ControllerParams.BODY:
          return this.request._internalTransformedBody;
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