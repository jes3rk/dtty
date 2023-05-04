import { IsEmail } from "class-validator";
import { Body, Controller, Post } from "../src";

export class ValidatorBody {
  @IsEmail()
  email: string;
}

@Controller("/validator")
export class ValidatorController {
  @Post("/test")
  test(@Body(ValidatorBody) body: ValidatorBody) {
    return {
      status: "It works!",
      ...body,
    };
  }
}
