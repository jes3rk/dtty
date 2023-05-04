import { Body, Controller, Post } from "../src";

export class BodyTestDto {
  hello: string;
}

@Controller("/body")
export class BodyController {
  @Post("/default")
  defaultBody(@Body() body: object) {
    return {
      bodyType: body.constructor.name,
    };
  }

  @Post("/specified")
  postBody(@Body(BodyTestDto) body: BodyTestDto) {
    return {
      bodyType: body.constructor.name,
    };
  }
}
