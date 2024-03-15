import "./env";
import { eventHandler, toWebRequest } from "vinxi/http";
import { hono } from "./hono";

export default eventHandler(async (event) => {
  return hono.fetch(toWebRequest(event));
});
