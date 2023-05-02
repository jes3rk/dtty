import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import * as request from "supertest";

describe("Index", () => {
  const endpoint = `http://127.0.0.1:8787`;
  let appProcess: ChildProcessWithoutNullStreams;
  let server: typeof request;

  beforeAll((done) => {
    appProcess = spawn("yarn", ["run:local"]);
    const startupMessages: string[] = [];
    appProcess.stdout.on("data", (data: Buffer) => {
      const parsed = data.toString();
      startupMessages.push(parsed);
      if (/Listening on/.test(parsed)) {
        console.log(startupMessages.join(""));
        done();
      }
    });
  });

  afterAll(async () => {
    appProcess.kill();
  });

  it("will return hello world from the index", () => {
    return request(endpoint)
      .get("/")
      .expect(200)
      .expect(({ body }) => {
        expect(body.text).toEqual("Hello World");
      });
  });
});
