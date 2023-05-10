import { UnstableDevWorker, unstable_dev } from "wrangler";

describe("ExceptionsHandler", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will catch a specific exception and handle at the method level", async () => {
    const res = await server.fetch("/exceptions/method/specific", {
      method: "GET",
    });
    expect(res.status).toEqual(500);

    const body = await res.json();
    expect(body).toMatchObject({
      handler: "MethodExceptionHandler",
    });
  });

  it("will catch a generic exception and handle at the method level", async () => {
    const res = await server.fetch("/exceptions/method/generic", {
      method: "GET",
    });
    expect(res.status).toEqual(500);

    const body = await res.json();
    expect(body).toMatchObject({
      handler: "GenericHandler",
      exception: "MethodException",
    });
  });

  it("will catch a generic exception and handle at the controller level", async () => {
    const res = await server.fetch("/exceptions/controller", { method: "GET" });
    expect(res.status).toEqual(500);

    const body = await res.json();
    expect(body).toMatchObject({
      handler: "GenericHandler",
      exception: "ControllerException",
    });
  });

  it("will catch a generic exception and handle at the global level", async () => {
    const res = await server.fetch("/exceptions/global", { method: "GET" });
    expect(res.status).toEqual(500);

    const body = await res.json();
    expect(body).toMatchObject({
      handler: "GenericHandler",
      exception: "GlobalException",
    });
  });
});
