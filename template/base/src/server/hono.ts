import { Hono } from "hono";

export const hono = new Hono().basePath("/api");

hono.get("/healthcheck", (ctx) => ctx.json({ ok: true }));
