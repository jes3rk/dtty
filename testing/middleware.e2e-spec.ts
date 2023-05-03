import { UnstableDevWorker, unstable_dev } from "wrangler";
import { MiddlewareTestingDto } from "./middleware.controller";

describe("MiddlewareTesting", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will return with a TRUE for global middleware only", async () => {
    const res = await server.fetch("/middleware", { method: "GET" });
    expect(res.status).toEqual(200);
    const expectedResponse = new MiddlewareTestingDto();
    expectedResponse.usedGlobalMiddleware = true;

    const body = await res.json();
    expect(body).toMatchObject(expectedResponse);
  });

  it("will return with a TRUE for class middleware", async () => {
    const res = await server.fetch("/middleware/classMiddleware", {
      method: "GET",
    });
    expect(res.status).toEqual(200);
    const expectedResponse = new MiddlewareTestingDto();
    expectedResponse.usedClassMiddleware = true;
    expectedResponse.usedGlobalMiddleware = true;

    const body = await res.json();
    expect(body).toMatchObject(expectedResponse);
  });

  it("will return with a TRUE for class middleware and method middleware", async () => {
    const res = await server.fetch(
      "/middleware/classMiddleware/methodMiddleware",
      { method: "GET" },
    );
    expect(res.status).toEqual(200);
    const expectedResponse = new MiddlewareTestingDto();
    expectedResponse.usedClassMiddleware = true;
    expectedResponse.usedGlobalMiddleware = true;
    expectedResponse.usedMethodMiddleware = true;

    const body = await res.json();
    expect(body).toMatchObject(expectedResponse);
  });
});
