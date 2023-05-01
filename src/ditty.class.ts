import { ExecutionContext } from "@cloudflare/workers-types";
import { Router } from "itty-router";
import "reflect-metadata";
import { Constructable, ContainerInstance } from "typedi";
import { CONTROLLER_ENDPOINTS_META, CONTROLLER_META } from "./constants";
import { Handler } from "./handler";
import { Logger } from "./logger";
import { CONTAINER_REF, LOGGER_TOKEN, ROUTER_TOKEN } from "./tokens";
import {
  ContainerRef,
  ControllerEndpointMetadata,
  RouterResponse,
} from "./types";

export class Ditty {
  private container: ContainerInstance;
  private logger: Logger;

  constructor() {
    this.container = new ContainerInstance("ditty");
    this.container.set<ContainerRef>(CONTAINER_REF, {
      get: <T>(token: Constructable<T>) => this.container.get(token),
      getServices: () => this.container["services"],
    });
    this.container.set(ROUTER_TOKEN, Router());
    this.container.set(LOGGER_TOKEN, new Logger());
    this.container.set({
      id: Handler,
      type: Handler,
      transient: false,
      eager: false,
    });
    // Internal mounts
    this.mountServices();

    this.logger = this.container.get(LOGGER_TOKEN);
  }

  public async handle(
    req: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const router = this.container.get(ROUTER_TOKEN);
    const rawResponse: RouterResponse = await router.handle(req, env, ctx);
    return new Response(JSON.stringify(rawResponse.data), {
      status: rawResponse.status,
    });
  }

  public mountServices(...services: any[]): void {
    services.forEach((s) => {
      this.container.set({
        id: s,
        type: s,
        multiple: false,
        eager: false,
        transient: false,
      });
    });
  }

  public registerControllers(...controllers: any[]): void {
    this.mountServices(...controllers);
    controllers.forEach((c) => {
      const path = Reflect.getMetadata(CONTROLLER_META, c);
      if (!path) return;
      const router = this.container.get(ROUTER_TOKEN);
      const endpoints: ControllerEndpointMetadata[] = Reflect.getMetadata(
        CONTROLLER_ENDPOINTS_META,
        c,
      );

      endpoints.forEach((e) => {
        const formattedPath = path + e.path.replace(/$\//, "");
        router[e.method](
          formattedPath,
          async (req): Promise<RouterResponse<any>> => {
            const handler = this.container.get(Handler);
            return handler.handle(c, e, req);
          },
        );

        this.logger.log(
          `Mounted route: [${e.method.toUpperCase()}] ${formattedPath}`,
        );
      });
    });
  }
}
