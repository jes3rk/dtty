import { Body, Controller, Get } from "../src";

@Controller("/")
export class IndexController {
  @Get("/")
  index(@Body() body: any) {
    return { text: "Hello World" };
  }
}
