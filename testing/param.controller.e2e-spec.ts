import { UnstableDevWorker, unstable_dev } from "wrangler";

describe("ParamController", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will parse and validate a string input", async () => {
    const input = "hello";
    const res = await server.fetch(`/param/string/${input}`, { method: "GET" });
    expect(res.status).toEqual(200);
    const body = await res.json();
    expect(body).toMatchObject({
      type: "string",
      value: input,
    });
  });

  it("will parse and validate a number input", async () => {
    const input = 1234;
    const res = await server.fetch(`/param/int/${input}`, { method: "GET" });
    expect(res.status).toEqual(200);
    const body = await res.json();
    expect(body).toMatchObject({
      type: "number",
      value: input,
    });
  });

  it("will throw a 400 for a non-number input", async () => {
    const input = "hello";
    const res = await server.fetch(`/param/int/${input}`, { method: "GET" });
    expect(res.status).toEqual(400);
  });
});
