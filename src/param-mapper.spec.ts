import { ControllerParams } from "./constants";
import { ParamMapper } from "./param-mapper";
import { ControllerParamMeta, DittyRequest } from "./types";

describe("ParamMapper", () => {
  let body: Record<string, unknown>;
  let request: DittyRequest;
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
    } as unknown as DittyRequest;
    mapper = new ParamMapper(request);
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
