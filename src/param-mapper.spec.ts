import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsString } from "class-validator";
import { container } from "tsyringe";
import { ControllerParams } from "./constants";
import { ValidationException } from "./exceptions/validation.exception";
import { ParamMapper } from "./param-mapper";
import { IntegerTransformer } from "./transformers/integer.transformer";
import { ControllerParamMeta, DttyRequest } from "./types";

describe("ParamMapper", () => {
  let body: Record<string, unknown>;
  let request: DttyRequest;
  let mapper: ParamMapper;
  let num: number;

  class QueryParams {
    @IsNumber()
    @Type(() => Number)
    num: number;

    @IsString()
    str: string;
  }

  class FailedQueryParams extends QueryParams {
    @IsDefined()
    missing: any;
  }

  beforeEach(() => {
    num = 1234;
    body = {
      hello: "world",
    };
    request = {
      query: {
        num: num.toString(),
        str: "hello World",
      },
      params: {
        id: "abc",
      },
      _internalTransformedBody: body,
    } as unknown as DttyRequest;
    mapper = new ParamMapper(request, container.createChildContainer());
  });

  it("will the BODY param out", () => {
    const meta: ControllerParamMeta = {
      type: ControllerParams.BODY,
    };
    const mapped = mapper.mapTo([meta]);
    expect(mapped).toHaveLength(1);
    expect(mapped[0]).toMatchObject(body);
  });

  describe("PARAM", () => {
    it("will map a named PARAM out as a string", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.PARAM,
        paramName: "id",
      };

      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toEqual(request.params.id);
    });

    it("will map a named PARAM out as a number if transformer is specified", () => {
      const num = 234321;
      request.params.id = num.toString();
      const meta: ControllerParamMeta = {
        type: ControllerParams.PARAM,
        paramName: "id",
        transformer: IntegerTransformer,
      };

      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toEqual(num);
    });

    it("will return all params if no name is specified", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.PARAM,
      };
      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toMatchObject(request.params);
    });
  });

  describe("QUERY", () => {
    it("will extract a named parameter", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.QUERY,
        paramName: "num",
      };

      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toEqual(request.query.num);
    });

    it("will extract a named parameter and transform it", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.QUERY,
        paramName: "num",
        transformer: IntegerTransformer,
      };
      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toEqual(num);
    });

    it("will extract the generic params", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.QUERY,
      };
      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toMatchObject(request.query);
    });
    it("will extract, transform, and validate the params object", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.QUERY,
        paramsType: QueryParams,
      };
      const mapped = mapper.mapTo([meta]);
      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toHaveProperty("num", num);
      expect(mapped[0]).toBeInstanceOf(QueryParams);
    });

    it("will throw an error if validation fails", () => {
      const meta: ControllerParamMeta = {
        type: ControllerParams.QUERY,
        paramsType: FailedQueryParams,
      };
      expect(() => mapper.mapTo([meta])).toThrowError(ValidationException);
    });
  });

  it("will map the REQUEST out", () => {
    const meta: ControllerParamMeta = {
      type: ControllerParams.REQUEST,
    };

    const mapped = mapper.mapTo([meta]);
    expect(mapped).toHaveLength(1);
    expect(mapped[0]).toMatchObject(request);
  });
});
