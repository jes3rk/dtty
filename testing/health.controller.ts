import { Controller, Get, IttyRequest } from "src";
import { ApplyMiddleware } from "src/decorators/apply-middleware.decorator";
import { Param, Request } from "src/decorators/contoller-params.decorator";
import { LoggerMiddleware } from "./logger.middleware";

@Controller("/health")
@ApplyMiddleware(LoggerMiddleware)
export class HealthController {
  @Get("/")
  @ApplyMiddleware(LoggerMiddleware)
  healthCheck(@Request() req: IttyRequest) {
    return {
      status: "OK",
      ev: req.method,
      mine: "yours",
    };
  }

  @Get("/:type")
  req(@Param("type") type: string) {
    return { type };
  }
}
