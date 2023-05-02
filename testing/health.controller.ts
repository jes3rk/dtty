import { Controller, Get } from "src";
import { ApplyMiddleware } from "src/decorators/apply-middleware.decorator";
import { LoggerMiddleware } from "./logger.middleware";

@Controller("/health")
@ApplyMiddleware(LoggerMiddleware)
export class HealthController {
  @Get("/")
  @ApplyMiddleware(LoggerMiddleware)
  healthCheck() {
    return {
      status: "OK",
    };
  }

  @Get("/req")
  req(req: any) {
    return req;
  }
}
