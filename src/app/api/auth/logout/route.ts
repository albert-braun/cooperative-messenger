import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jsonError, assertSameOrigin } from "@/server/security";
import { SESSION_COOKIE, destroySession } from "@/server/session";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Forbidden origin", 403);
  }

  const jar = await cookies();
  destroySession(jar.get(SESSION_COOKIE)?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
