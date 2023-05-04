import { UnstableDevWorker, unstable_dev } from "wrangler";
import { BodyTestDto } from "./body.controller";

describe("Body Controller", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will return the specified type of the body", async () => {
    const body = new BodyTestDto();
    body.hello = "word";
    const res = await server.fetch("/body/specified", {
      method: "POST",
      body: JSON.stringify(body),
    });
    expect(res.status).toEqual(200);

    const resBody = await res.json();
    expect(resBody).toHaveProperty("bodyType", body.constructor.name);
  });

  it("will return the default type of the body", async () => {
    const body = new BodyTestDto();
    body.hello = "word";
    const res = await server.fetch("/body/default", {
      method: "POST",
      body: JSON.stringify(body),
    });
    expect(res.status).toEqual(200);

    const resBody = await res.json();
    expect(resBody).toHaveProperty("bodyType", Object.name);
  });
});
