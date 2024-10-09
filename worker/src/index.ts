import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import { DB } from "./db/schema";
import { zValidator } from "@hono/zod-validator";
import { scoreSchema } from "./schema/score";
import cuid from "cuid";

const app = new Hono<{ Bindings: Env; Variables: { db: Kysely<DB> } }>();

app.use(
  "*",
  cors({
    origin: [
      "https://solshack.aaronah02.workers.dev",
      "https://solshack.phrogwrld.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  if (!c.get("db")) {
    const db = new Kysely<DB>({
      dialect: new D1Dialect({ database: c.env.DB }),
    });
    c.set("db", db);
  }
  await next();
});

app.get("/", async (c) => {
  c.text("Hello, world!");

  return c.json(await c.var.db.selectFrom("Leaderboard").selectAll().execute());
});

app.get("/leaderboard", async (c) => {
  const db = c.get("db");

  const topScorest = await c.env.DB.prepare(
    "SELECT * FROM Leaderboard ORDER BY score DESC LIMIT 10"
  ).all();
  console.log(topScorest.results);

  const topScores = await db
    .selectFrom("Leaderboard")
    .selectAll()
    .orderBy("score", "desc")
    .limit(10)
    .execute();

  return c.json(topScores);
});

app.post("/leaderboard", zValidator("json", scoreSchema), async (c) => {
  const { name, score } = c.req.valid("json");
  console.log(name, score);
  const db = c.get("db");

  const id = cuid();

  await db.insertInto("Leaderboard").values({ id, name, score }).execute();

  return c.json({ message: "Score submitted successfully" }, 201);
});

export default app;
