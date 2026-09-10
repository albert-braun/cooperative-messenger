import { NextResponse } from "next/server";
import { db, sleep } from "@/server/db";
import { jsonError, assertSameOrigin } from "@/server/security";
import { getCurrentUser } from "@/server/session";
import { canSendMessage } from "@/features/auth/permissions";
import { sanitizeMessage, unescapePreview } from "@/shared/lib/sanitize";
import type { Message } from "@/entities/types";

const DEFAULT_LIMIT = 24;

export async function GET(request: Request) {
  await sleep(200);
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const url = new URL(request.url);
  const channelId = url.searchParams.get("channelId");
  const before = url.searchParams.get("before");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT), 50);

  if (!channelId) return jsonError("channelId is required", 400);

  const channel = db.channels.find((item) => item.id === channelId);
  if (!channel) return jsonError("Channel not found", 404);

  const ordered = db.messages
    .filter((message) => message.channelId === channelId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let end = ordered.length;
  if (before) {
    const index = ordered.findIndex((message) => message.id === before);
    end = index === -1 ? ordered.length : index;
  }

  const start = Math.max(0, end - limit);
  const items = ordered.slice(start, end);
  const nextCursor = start > 0 ? items[0]?.id ?? null : null;

  return NextResponse.json({ items, nextCursor });
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return jsonError("Forbidden origin", 403);
  }

  await sleep(180);
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  if (!canSendMessage(user.role)) {
    return jsonError("Guests cannot send messages", 403);
  }

  const body = (await request.json().catch(() => ({}))) as {
    channelId?: string;
    body?: string;
  };

  if (!body.channelId || !body.body) {
    return jsonError("channelId and body are required", 400);
  }

  const channel = db.channels.find((item) => item.id === body.channelId);
  if (!channel) return jsonError("Channel not found", 404);

  const clean = unescapePreview(sanitizeMessage(body.body));
  if (!clean) return jsonError("Message is empty", 400);

  const message: Message = {
    id: `msg-${crypto.randomUUID()}`,
    channelId: body.channelId,
    authorId: user.id,
    body: clean,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(message);
  channel.unread = 0;
  return NextResponse.json(message, { status: 201 });
}
