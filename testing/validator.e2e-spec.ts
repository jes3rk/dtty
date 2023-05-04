import { UnstableDevWorker, unstable_dev } from "wrangler";
import { ValidatorBody } from "./validator.controller";

describe("Validator", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  it("will succeed with a valid payload", async () => {
    const reqBody = new ValidatorBody();
    reqBody.email = "test@mail.co";

    const res = await server.fetch("/validator/test", {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
    expect(res.status).toEqual(200);
  });

  it("will fail with an invalid payload", async () => {
    const reqBody = new ValidatorBody();
    reqBody.email = "not and email";

    const res = await server.fetch("/validator/test", {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
    expect(res.status).toEqual(400);
  });
});
