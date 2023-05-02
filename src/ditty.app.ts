import { ExecutionContext } from "@cloudflare/workers-types";
import { Router, RouterType } from "itty-router";
import { DependencyContainer, container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import {
  APPLY_MIDDLEWARE_META,
  CONTROLLER_ENDPOINTS_META,
  CONTROLLER_META,
} from "./constants";
import { Handler } from "./handler";
import { DittyMiddleware } from "./interfaces/middleware.interface";
import { Logger } from "./logger";
import { ROUTER_TOKEN } from "./tokens";
import {
  ControllerEndpointMetadata,
  IttyRequest,
  RouterResponse,
} from "./types";

export class Ditty {
  private container: DependencyContainer;
  private logger: Logger;

  constructor() {
    this.container = container;
    this.container.register(ROUTER_TOKEN, { useValue: Router() });
    this.logger = this.container.resolve(Logger);
  }

  public async handle(
    req: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const router = this.container.resolve<RouterType>(ROUTER_TOKEN);
    const rawResponse: RouterResponse = await router.handle(req, env, ctx);
    return new Response(JSON.stringify(rawResponse.data), {
      status: rawResponse.status,
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

    const router = this.container.resolve<RouterType>(ROUTER_TOKEN);

    const controllerMiddleware: constructor<DittyMiddleware>[] =
      Reflect.getMetadata(APPLY_MIDDLEWARE_META, controllerToken) || [];

    endpoints.forEach((endpoint) => {
      const fullPath = rootPath + endpoint.path.replace(/$\//, "");

      const endpointHandler =
        container.resolve(controllerToken)[endpoint.propertyKey];
      const endpointMiddleware: constructor<DittyMiddleware>[] =
        Reflect.getMetadata(APPLY_MIDDLEWARE_META, endpointHandler) || [];

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
          const handler = this.container.resolve<Handler>(Handler);
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
 * - Controller middleware [x]
 * - Method middleware [x]
 * - Method Transformer
 * - Method Validator
 * - *Method itself*
 * - Method exception handler
 * - Controller exception handler
 * - Global exception handler
 */
