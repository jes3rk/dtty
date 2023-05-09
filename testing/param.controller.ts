import { Controller, Get, IntegerTransformer, Param } from "../src";

@Controller("/param")
export class ParamController {
  @Get("/string/:input")
  handleString(@Param("input") input: string) {
    return {
      type: typeof input,
      value: input,
    };
  }

  @Get("/int/:input")
  handleInt(@Param("input", IntegerTransformer) input: number) {
    return {
      type: typeof input,
      value: input,
    };
  }
}
