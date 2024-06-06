import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import LoginForm from "../components/LoginForm.tsx";
import { State } from "../types.ts";
// @deno-types="npm:@types/jsonwebtoken"
import jwt from "npm:jsonwebtoken";

type Data = {
  showError?: boolean;
};

type ApiRes = {
  email: string;
  name: string;
  id: string;
};

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export const handler: Handlers<Data, State> = {
  POST: async (req, ctx) => {
    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");
    if (!email || !password) {
      return ctx.render({ showError: true });
    }

    const res = await fetch("https://videoapp-api.deno.dev/checkuser", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: { "content-type": "application/json" },
    });
    if (!res.ok) {
      return ctx.render({ showError: true });
    }
    const data = await res.json() as ApiRes;

    const token = jwt.sign(data, Deno.env.get("SCRT"), {
      expiresIn: "24h",
    });
    const url = new URL(req.url);
    const headers = new Headers();
    headers.set("location", "/");
    setCookie(headers, {
      name: "auth",
      value: token,
      secure: true,
      sameSite: "Lax",
      path: "/",
      domain: url.hostname,
    });

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

export default (props: PageProps<Data>) => {
  const showError = props.data?.showError || false;
  return <LoginForm showError={showError} />;
};
