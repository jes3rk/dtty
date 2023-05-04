import {
  ApplyMiddleware,
  Controller,
  DittyRequest,
  Get,
  Param,
  Request,
} from "../src";
import { LoggerMiddleware } from "./logger.middleware";

@Controller("/health")
@ApplyMiddleware(LoggerMiddleware)
export class HealthController {
  @Get("/")
  @ApplyMiddleware(LoggerMiddleware)
  healthCheck(@Request() req: DittyRequest) {
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
