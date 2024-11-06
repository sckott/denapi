import { Hono } from "@hono/hono";
import { assertEquals } from "@std/assert";

Deno.test("Hello World", async () => {
  const app = new Hono();
  app.get("/", (c) => c.text("Hello from the Trees!"));

  const res = await app.request("http://localhost/");
  assertEquals(res.status, 200);
});
