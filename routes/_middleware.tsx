import { FreshContext } from "$fresh/server.ts";
import type { State } from "../types.ts";
import { getCookies } from "$std/http/cookie.ts";
// @deno-types="npm:@types/jsonwebtoken"
import jwt from "npm:jsonwebtoken";

export async function handler(req: Request, ctx: FreshContext<State>) {
  if (
    ctx.destination !== "route" || ctx.route === "/login" ||
    ctx.route === "/register"
  ) {
    return await ctx.next();
  }

  const auth = getCookies(req.headers).auth;
  if (!auth) {
    return new Response(null, {
      status: 307,
      headers: { "location": "/login" },
    });
  }

  const secret = Deno.env.get("SCRT");
  if (!secret) {
    throw new Error("No secret provided");
  }

  try {
    const { email, id, name } = jwt.verify(auth, secret) as State;
    ctx.state = { email, id, name };
    return await ctx.next();
  } catch (e) {
    return new Response(null, {
      status: 307,
      headers: { "location": "/login" },
    });
  }
}
