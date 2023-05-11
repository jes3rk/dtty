import { UnstableDevWorker, unstable_dev } from "wrangler";

describe("QueryParams", () => {
  let server: UnstableDevWorker;

  beforeAll(async () => {
    server = await unstable_dev("./testing/index.ts");
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("named query", () => {
    it("will correctly handle a number param as a string", async () => {
      const num = 1234;
      const res = await server.fetch(`/query/named?test=${num}`, {
        method: "GET",
      });
      expect(res.status).toEqual(200);

      const body = await res.json();
      expect(body).toHaveProperty("value", num.toString());
    });
    it("will correctly handle a number param as a number", async () => {
      const num = 1234;
      const res = await server.fetch(`/query/named/transformed?test=${num}`, {
        method: "GET",
      });
      expect(res.status).toEqual(200);

      const body = await res.json();
      expect(body).toHaveProperty("value", num);
    });
  });

  describe("unnamed query", () => {
    it("will parse the values into an object", async () => {
      const num = 124;
      const res = await server.fetch(`/query/unnamed?test=${num}`, {
        method: "GET",
      });
      expect(res.status).toEqual(200);

      const body = await res.json();
      expect(body).toHaveProperty("values", {
        test: num.toString(),
      });
    });

    it("will correctly validate the query params as an object", async () => {
      const num = 124;
      const res = await server.fetch(`/query/unnamed/validated?test=${num}`, {
        method: "GET",
      });
      expect(res.status).toEqual(200);

      const body = await res.json();
      expect(body).toHaveProperty("values", {
        test: num,
      });
    });
    it("will throw an error if the validation fails", async () => {
      const num = "hello world";
      const res = await server.fetch(`/query/unnamed/validated?test=${num}`, {
        method: "GET",
      });
      expect(res.status).toEqual(400);
    });
  });
});
