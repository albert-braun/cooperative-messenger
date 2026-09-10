import { NextResponse } from "next/server";
import { db, sleep, toSessionUser } from "@/server/db";
import { jsonError, assertSameOrigin } from "@/server/security";
import {
  SESSION_COOKIE,
  createSessionToken,
} from "@/server/session";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Forbidden origin", 403);
  }

  await sleep(180);
  const body = (await request.json().catch(() => ({}))) as {
    userId?: string;
    email?: string;
    password?: string;
  };

  const user = db.users.find((item) => {
    if (body.userId) return item.id === body.userId;
    return (
      item.email.toLowerCase() === body.email?.toLowerCase() &&
      item.password === body.password
    );
  });

  if (!user) {
    return jsonError("Invalid credentials", 401);
  }

  const token = createSessionToken(user.id);
  const response = NextResponse.json(toSessionUser(user));
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
