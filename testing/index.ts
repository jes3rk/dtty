import { ExecutionContext } from "@cloudflare/workers-types";
import { Ditty } from "src";
import { HealthController } from "./health.controller";
import { IndexController } from "./index.controller";

const app = new Ditty();
app.registerControllers(HealthController, IndexController);

export default {
  async fetch(
    request: Request,
    env: Record<string, any>,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return app.handle(request, env, ctx);
  },
};
