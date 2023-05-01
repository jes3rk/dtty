import { Constructable, Inject } from "typedi";
import { CONTAINER_REF } from "./tokens";
import {
  ContainerRef,
  ControllerEndpointMetadata,
  IttyRequest,
  RouterResponse,
} from "./types";

export class Handler {
  constructor(
    @Inject(CONTAINER_REF) private readonly containerRef: ContainerRef,
  ) {}

  public async handle(
    controllerToken: Constructable<any>,
    endpoint: ControllerEndpointMetadata,
    req: IttyRequest,
  ): Promise<RouterResponse> {
    let status: number;
    let data: unknown;
    try {
      data = (await this.containerRef
        .get(controllerToken)
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
