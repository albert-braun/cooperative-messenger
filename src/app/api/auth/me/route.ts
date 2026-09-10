import { NextResponse } from "next/server";
import { sleep } from "@/server/db";
import { jsonError } from "@/server/security";
import { getCurrentUser } from "@/server/session";

export async function GET() {
  await sleep(120);
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  return NextResponse.json(user);
}
