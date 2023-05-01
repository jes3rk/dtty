import { IRequest } from "itty-router";
import { Constructable, Inject } from "typedi";
import { CONTAINER_REF } from "./tokens";
import {
  ContainerRef,
  ControllerEndpointMetadata,
  RouterResponse,
} from "./types";

export class Handler {
  constructor(
    @Inject(CONTAINER_REF) private readonly containerRef: ContainerRef,
  ) {}

  public async handle(
    controllerToken: Constructable<any>,
    endpoint: ControllerEndpointMetadata,
    req: IRequest,
  ): Promise<RouterResponse> {
    return {
      data: (await this.containerRef
        .get(controllerToken)
        [endpoint.propertyKey](req)) as any,
      status: 200,
    };
  }
}
