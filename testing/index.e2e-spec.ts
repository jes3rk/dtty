import { UnstableDevWorker, unstable_dev } from "wrangler";

describe("Index", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will return hello world from the index", async () => {
    const res = await server.fetch("/", { method: "GET" });
    expect(res.status).toEqual(200);
    expect(await res.json()).toHaveProperty("text", "Hello World");
  });
});
