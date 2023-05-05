import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { Injectable } from "./decorators/injectable.decorator";
import {
  ControllerEndpointMetadata,
  DttyRequest,
  RouterResponse,
} from "./types";

@Injectable()
export class Handler {
  public async handle(
    controllerToken: constructor<any>,
    endpoint: ControllerEndpointMetadata,
    req: DttyRequest,
  ): Promise<RouterResponse> {
    let status: number;
    let data: unknown;
    try {
      data = (await container
        .resolve(controllerToken)
        [endpoint.propertyKey](req)) as any;
      status = 200;
    } catch (err) {
      data = err;
      status = 500;
    } finally {
      return {
        data,
        status,
      };
    }
  }
}
