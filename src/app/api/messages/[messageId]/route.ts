import { NextResponse } from "next/server";
import { db, sleep } from "@/server/db";
import { jsonError, assertSameOrigin } from "@/server/security";
import { getCurrentUser } from "@/server/session";
import { canDeleteMessage } from "@/features/auth/permissions";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageId: string }> },
) {
  if (!assertSameOrigin(request)) {
    return jsonError("Forbidden origin", 403);
  }

  await sleep(160);
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const { messageId } = await context.params;
  const index = db.messages.findIndex((message) => message.id === messageId);
  if (index === -1) return jsonError("Message not found", 404);

  const message = db.messages[index];
  if (!canDeleteMessage(user.role, message.authorId === user.id)) {
    return jsonError("Not allowed to delete this message", 403);
  }

  db.messages.splice(index, 1);
  return NextResponse.json({ ok: true });
}
