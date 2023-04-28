import { Controller, Get } from "src";

@Controller("/health")
export class HealthController {
  @Get("/")
  healthCheck() {
    return {
      status: "OK",
    };
  }
}
