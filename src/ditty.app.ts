import { ExecutionContext } from "@cloudflare/workers-types";
import { Router, RouterType } from "itty-router";
import { Logger } from "src";
import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import {
  APPLY_MIDDLEWARE_META,
  CONTROLLER_ENDPOINTS_META,
  CONTROLLER_META,
  CONTROLLER_PARAM_META,
} from "./constants";
import { DittyConfig } from "./interfaces/ditty-config.interface";
import { DittyMiddleware } from "./interfaces/middleware.interface";
import { DefaultLogger } from "./logger";
import { ParamMapper } from "./param-mapper";
import { LOGGER_TOKEN, ROUTER_TOKEN } from "./tokens";
import {
  ControllerEndpointMetadata,
  ControllerParamMeta,
  IttyRequest,
  RouterResponse,
} from "./types";

export class Ditty {
  private logger: Logger;

  constructor(config: DittyConfig = {}) {
    const { logger = DefaultLogger } = config;
    container.register(ROUTER_TOKEN, { useValue: Router() });
    container.register(LOGGER_TOKEN, { useClass: logger });
    this.logger = container.resolve(LOGGER_TOKEN);
  }

  public async handle(
    req: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const router = container.resolve<RouterType>(ROUTER_TOKEN);
    const rawResponse: RouterResponse = await router.handle(req, env, ctx);
    return new Response(JSON.stringify(rawResponse.data), {
      status: rawResponse.status,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  public registerControllers(...controllers: constructor<any>[]): void {
    controllers.forEach((c) => {
      this.mountRoutes(c);
    });
  }

  private mountRoutes(controllerToken: constructor<any>): void {
    const rootPath = Reflect.getMetadata(CONTROLLER_META, controllerToken);
    if (!rootPath) return;
    const endpoints: ControllerEndpointMetadata[] = Reflect.getMetadata(
      CONTROLLER_ENDPOINTS_META,
      controllerToken,
    );
    if (!endpoints || !Array.isArray(endpoints)) return;

    const router = container.resolve<RouterType>(ROUTER_TOKEN);

    const controllerMiddleware: constructor<DittyMiddleware>[] =
      Reflect.getMetadata(APPLY_MIDDLEWARE_META, controllerToken) || [];

    endpoints.forEach((endpoint) => {
      const fullPath = rootPath + endpoint.path.replace(/\/$/, "");

      const endpointHandler =
        container.resolve(controllerToken)[endpoint.propertyKey];
      const endpointMiddleware: constructor<DittyMiddleware>[] =
        Reflect.getMetadata(APPLY_MIDDLEWARE_META, endpointHandler) || [];

      const endpointParamMeta: ControllerParamMeta[] =
        Reflect.getMetadata(CONTROLLER_PARAM_META, endpointHandler) || [];

      router[endpoint.method](
        fullPath,
        ...controllerMiddleware.map(
          (middleware) => (req: IttyRequest) =>
            container.resolve<DittyMiddleware>(middleware).apply(req),
        ),
        ...endpointMiddleware.map(
          (middleware) => (req: IttyRequest) =>
            container.resolve<DittyMiddleware>(middleware).apply(req),
        ),
        (req: IttyRequest) => {
          const mapper = new ParamMapper(req);
          const response = endpointHandler(...mapper.mapTo(endpointParamMeta));
          return {
            data: response,
            status: 200,
          };
        },
      );

      this.logger.log(
        `Mounted route: [${endpoint.method.toUpperCase()}] ${fullPath}`,
      );
    });
  }

  /**
   * Add global middleware handlers
   * Call this method before registering controllers
   */
  public setGlobalMiddleware(...handlers: constructor<DittyMiddleware>[]) {
    container
      .resolve<RouterType>(ROUTER_TOKEN)
      .all(
        "*",
        ...handlers.map(
          (middleware) => (req: IttyRequest) =>
            container.resolve(middleware).apply(req),
        ),
      );
  }
}

/**
 * Process
 * - Global middleware
 * - Controller middleware [x]
 * - Method middleware [x]
 * - Method Transformer
 * - Method Validator
 * - *Method itself*
 * - Method exception handler
 * - Controller exception handler
 * - Global exception handler
 */
