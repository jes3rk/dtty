import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { Controller, Get, IntegerTransformer, Query } from "../src";

export class QueryDto {
  @IsNumber()
  @Type(() => Number)
  test: number;
}

@Controller("/query")
export class QueryParamController {
  @Get("/named")
  handleNamedParam(@Query({ paramName: "test" }) value: string) {
    return {
      value,
    };
  }

  @Get("/unnamed")
  handleUnnamed(@Query() values: Record<string, unknown>) {
    return {
      values,
    };
  }

  @Get("/named/transformed")
  handleNamedAndTransformed(
    @Query({ paramName: "test", transformer: IntegerTransformer })
    value: number,
  ) {
    return {
      value,
    };
  }

  @Get("/unnamed/validated")
  handleUnnamedAndValidated(@Query({ paramsType: QueryDto }) values: QueryDto) {
    return {
      values,
    };
  }
}
