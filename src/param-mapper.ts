import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { DependencyContainer } from "tsyringe";
import { ControllerParams } from "./constants";
import { ValidationException } from "./exceptions/validation.exception";
import { DttyTransformer } from "./interfaces/transformer.interface";
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

  private handleQuery(
    meta: ControllerParamMeta,
  ): undefined | string | number | unknown {
    if (meta.type !== ControllerParams.QUERY) return undefined;
    if (meta["paramName"]) {
      const param = this.request.query[meta["paramName"]];
      return meta["transformer"]
        ? this.container
            .resolve<DttyTransformer<unknown>>(meta["transformer"])
            .transform(param)
        : param;
    }
    if (meta["paramsType"]) {
      const instance: object = plainToInstance(
        meta["paramsType"],
        this.request.query,
      );
      const errors = validateSync(instance);
      if (errors.length > 0) {
        throw new ValidationException(errors);
      }
      return instance;
    }
    return this.request.query;
  }

  public mapTo(metadata: ControllerParamMeta[]): unknown[] {
    return metadata.map((meta) => {
      switch (meta.type) {
        case ControllerParams.BODY:
          return this.request._internalTransformedBody;
        case ControllerParams.PARAM:
          return this.handleParam(meta);
        case ControllerParams.QUERY:
          return this.handleQuery(meta);
        case ControllerParams.REQUEST:
          return this.handleRequest();
        default:
          throw new Error("Invalid Param Type");
      }
    });
  }
}
