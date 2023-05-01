import { ExecutionContext } from "@cloudflare/workers-types";
import { Router } from "itty-router";
import "reflect-metadata";
import { ContainerInstance } from "typedi";
import { ROUTER_TOKEN } from "./tokens";
import { ControllerEndpointMetadata } from "./types";
import { CONTROLLER_ENDPOINTS_META, CONTROLLER_META } from "./constants";


export class Ditty {
  private container: ContainerInstance;

  constructor() {
    this.container = new ContainerInstance('');
    this.container.set(ROUTER_TOKEN, Router())
  }

  public async handle(
    req: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const router = this.container.get(ROUTER_TOKEN);
    const rawResponse = await router.handle(req, env, ctx);
    return new Response(JSON.stringify(rawResponse));
  }

  public registerControllers(...controllers: any[]): void {
    controllers.forEach((c) => {
      this.container.set({
        id: c,
        type: c,
        multiple: false,
        eager: false,
        transient: false,
      });
      const path = Reflect.getMetadata(CONTROLLER_META, c.constructor);
      if (!path) return;
      const router = this.container.get(ROUTER_TOKEN);
      const endpoints: ControllerEndpointMetadata[] = Reflect.getMetadata(
        CONTROLLER_ENDPOINTS_META,
        c,
      );
      endpoints.forEach((e) => {
        const formattedPath = path + e.path.replace(/$\//, '');
        router[e.method](formattedPath, async (req) => {
          const controller = this.container.get(c)
          return controller[e.propertyKey](req);
        });
        console.log(`Mounted route: [${e.method.toUpperCase()}] ${formattedPath}`)
      });
    });
  }
}
