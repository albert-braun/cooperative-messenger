import { NextResponse } from "next/server";
import { db, sleep } from "@/server/db";
import { jsonError } from "@/server/security";
import { getCurrentUser } from "@/server/session";

export async function GET(request: Request) {
  await sleep();
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) return jsonError("workspaceId is required", 400);

  const list = db.channels
    .filter((channel) => channel.workspaceId === workspaceId)
    .filter(
      (channel) =>
        channel.kind === "channel" || channel.memberIds.includes(user.id),
    )
    .map((channel) => {
      if (channel.kind !== "dm") return channel;
      const otherId =
        channel.memberIds.find((id) => id !== user.id) ?? channel.memberIds[0];
      const other = db.users.find((item) => item.id === otherId);
      return {
        ...channel,
        name: other?.name ?? channel.name,
      };
    });

  return NextResponse.json(list);
}
