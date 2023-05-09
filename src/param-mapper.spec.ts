import { container } from "tsyringe";
import { ControllerParams } from "./constants";
import { ParamMapper } from "./param-mapper";
import { IntegerTransformer } from "./transformers/integer.transformer";
import { ControllerParamMeta, DttyRequest } from "./types";

describe("ParamMapper", () => {
  let body: Record<string, unknown>;
  let request: DttyRequest;
  let mapper: ParamMapper;

  beforeEach(() => {
    body = {
      hello: "world",
    };
    request = {
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

  it("will map the REQUEST out", () => {
    const meta: ControllerParamMeta = {
      type: ControllerParams.REQUEST,
    };

    const mapped = mapper.mapTo([meta]);
    expect(mapped).toHaveLength(1);
    expect(mapped[0]).toMatchObject(request);
  });
});
