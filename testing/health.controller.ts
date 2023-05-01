import { Controller, Get } from "src";

@Controller("/health")
export class HealthController {
  @Get("/")
  healthCheck() {
    return {
      status: "OK",
    };
  }

  @Get('/req')
  req(req: any) {
    return req;
  }
}
