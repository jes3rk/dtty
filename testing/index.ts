import { ExecutionContext } from "@cloudflare/workers-types";
import { Dtty } from "../src";
import { BodyController } from "./body.controller";
import {
  ExceptionsController,
  GenericHandler,
  GlobalExceptionsController,
} from "./exceptions.controller";
import { HealthController } from "./health.controller";
import { IndexController } from "./index.controller";
import {
  GlobalMiddleware,
  GlobalMiddlewareTestingController,
  MiddlewareTestingController,
} from "./middleware.controller";
import { ParamController } from "./param.controller";
import { QueryParamController } from "./query-param.controller";
import { ValidatorController } from "./validator.controller";

const app = new Dtty();
app.setGlobalMiddleware(GlobalMiddleware);
app.setGlobalExceptionHandlers(GenericHandler);
app.registerControllers(
  BodyController,
  ExceptionsController,
  GlobalExceptionsController,
  GlobalMiddlewareTestingController,
  HealthController,
  IndexController,
  MiddlewareTestingController,
  ParamController,
  QueryParamController,
  ValidatorController,
);

export default {
  async fetch(
    request: Request,
    env?: Record<string, any>,
    ctx?: ExecutionContext,
  ): Promise<Response> {
    return app.handle(request, env, ctx);
  },
};
