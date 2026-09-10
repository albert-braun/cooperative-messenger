import { NextResponse } from "next/server";
import { db, sleep } from "@/server/db";
import { jsonError } from "@/server/security";
import { getCurrentUser } from "@/server/session";

export async function GET() {
  await sleep();
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  return NextResponse.json(db.workspaces);
}
