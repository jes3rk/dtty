import { Body, Controller, Inject, Post } from "../src";
import { BodyService } from "./body.service";

export class BodyTestDto {
  hello: string;
}

@Controller("/body")
export class BodyController {
  constructor(@Inject(BodyService) private readonly service: BodyService) {}

  @Post("/default")
  defaultBody(@Body() body: object) {
    return this.service.mapBody(body);
  }

  @Post("/specified")
  postBody(@Body(BodyTestDto) body: BodyTestDto) {
    return this.service.mapBody(body);
  }
}
