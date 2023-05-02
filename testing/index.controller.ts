import { Controller, Get } from "src";

@Controller("/")
export class IndexController {
  @Get("/")
  index() {
    return { text: "Hello World" };
  }
}
