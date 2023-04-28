import { ExecutionContext } from "@cloudflare/workers-types";
import { Router } from "itty-router";
import "reflect-metadata";
import Container, { Service } from "typedi";
import { ROUTER_TOKEN } from "./tokens";

Container.set(ROUTER_TOKEN, Router());

export class Ditty {
  public async handle(
    req: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const router = Container.get(ROUTER_TOKEN);
    const rawResponse = await router.handle(req, env, ctx);
    return new Response(JSON.stringify(rawResponse));
  }

  public registerControllers(...controllers: any[]): void {
    controllers.forEach((c) => Service()(c));
  }
}
