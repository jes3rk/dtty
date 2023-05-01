import { ExecutionContext } from "@cloudflare/workers-types";
import { Router } from "itty-router";
import "reflect-metadata";
import { Constructable, ContainerInstance } from "typedi";
import {
  APPLY_MIDDLEWARE_META,
  CONTROLLER_ENDPOINTS_META,
  CONTROLLER_META,
} from "./constants";
import { Handler } from "./handler";
import { DittyMiddleware } from "./interfaces/middleware.interface";
import { Logger } from "./logger";
import { CONTAINER_REF, LOGGER_TOKEN, ROUTER_TOKEN } from "./tokens";
import {
  ContainerRef,
  ControllerEndpointMetadata,
  IttyRequest,
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
    // this.container.set(LOGGER_TOKEN, new Logger());

    // Internal mounts
    this.mountServices(Logger, Handler);

    console.log(this.container["services"]);
    this.container.set(ROUTER_TOKEN, Router());
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

  public mountServices(...services: Constructable<any>[]): void {
    services.forEach((s) => {
      this.container.set({
        id: s.name,
        type: s,
        multiple: false,
        eager: false,
        transient: false,
      });
    });
  }

  public registerControllers(...controllers: Constructable<any>[]): void {
    this.mountServices(...controllers);
    controllers.forEach((c) => {
      this.mountControllerMiddleware(c);
      this.mountRoutes(c);
    });
  }

  private mountControllerMiddleware(controllerToken: Constructable<any>): void {
    const middleware: Constructable<DittyMiddleware>[] = Reflect.getMetadata(
      APPLY_MIDDLEWARE_META,
      controllerToken,
    );
    if (!middleware || !Array.isArray(middleware)) return;
    this.mountServices(...middleware);
  }

  private mountRoutes(controllerToken: Constructable<any>): void {
    const rootPath = Reflect.getMetadata(CONTROLLER_META, controllerToken);
    if (!rootPath) return;
    const endpoints: ControllerEndpointMetadata[] = Reflect.getMetadata(
      CONTROLLER_ENDPOINTS_META,
      controllerToken,
    );
    if (!endpoints || !Array.isArray(endpoints)) return;

    const router = this.container.get(ROUTER_TOKEN);
    const controllerMiddleware: Constructable<DittyMiddleware>[] =
      Reflect.getMetadata(APPLY_MIDDLEWARE_META, controllerToken) || [];
    endpoints.forEach((endpoint) => {
      const fullPath = rootPath + endpoint.path.replace(/$\//, "");
      router[endpoint.method](
        fullPath,
        ...controllerMiddleware.map(
          (middleware) => (req: IttyRequest) =>
            this.container.get(middleware).apply(req),
        ),
        (req: IttyRequest) => {
          const handler = this.container.get(Handler);
          return handler.handle(controllerToken, endpoint, req);
        },
      );
      this.logger.log(
        `Mounted route: [${endpoint.method.toUpperCase()}] ${fullPath}`,
      );
    });
  }
}

/**
 * Process
 * - Global middleware
 * - Controller middleware
 * - Method middleware
 * - Method Transformer
 * - Method Validator
 * - *Method itself*
 * - Method exception handler
 * - Controller exception handler
 * - Global exception handler
 */
