import { db, sleep, toSessionUser } from "@/server/db";
import { ApiError } from "@/shared/api/errors";
import { canDeleteMessage, canSendMessage } from "@/features/auth/permissions";
import { sanitizeMessage, unescapePreview } from "@/shared/lib/sanitize";
import type {
  Channel,
  Message,
  PageResult,
  SessionUser,
  User,
  Workspace,
} from "@/entities/types";

const SESSION_KEY = "nx_session_user";

function readUserId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

function writeUserId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(SESSION_KEY, id);
  else window.localStorage.removeItem(SESSION_KEY);
}

function requireUser(): SessionUser {
  const user = db.users.find((item) => item.id === readUserId());
  if (!user) throw new ApiError(401, "Unauthorized");
  return toSessionUser(user);
}

function listChannels(workspaceId: string, userId: string): Channel[] {
  return db.channels
    .filter((channel) => channel.workspaceId === workspaceId)
    .filter(
      (channel) =>
        channel.kind === "channel" || channel.memberIds.includes(userId),
    )
    .map((channel) => {
      if (channel.kind !== "dm") return channel;
      const otherId =
        channel.memberIds.find((id) => id !== userId) ?? channel.memberIds[0];
      const other = db.users.find((item) => item.id === otherId);
      return { ...channel, name: other?.name ?? channel.name };
    });
}

function pageMessages(channelId: string, cursor: string | null): PageResult<Message> {
  const ordered = db.messages
    .filter((message) => message.channelId === channelId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  let end = ordered.length;
  if (cursor) {
    const index = ordered.findIndex((message) => message.id === cursor);
    end = index === -1 ? ordered.length : index;
  }
  const start = Math.max(0, end - 24);
  const items = ordered.slice(start, end);
  return { items, nextCursor: start > 0 ? items[0]?.id ?? null : null };
}

export const localApi = {
  async me() {
    await sleep(80);
    return requireUser();
  },
  async login(payload: { userId?: string; email?: string; password?: string }) {
    await sleep(120);
    const user = db.users.find((item) => {
      if (payload.userId) return item.id === payload.userId;
      return (
        item.email.toLowerCase() === payload.email?.toLowerCase() &&
        item.password === payload.password
      );
    });
    if (!user) throw new ApiError(401, "Invalid credentials");
    writeUserId(user.id);
    return toSessionUser(user);
  },
  async logout() {
    writeUserId(null);
    return { ok: true as const };
  },
  async workspaces(): Promise<Workspace[]> {
    await sleep(80);
    requireUser();
    return db.workspaces;
  },
  async channels(workspaceId: string) {
    await sleep(80);
    const user = requireUser();
    return listChannels(workspaceId, user.id);
  },
  async users(): Promise<Array<Omit<User, "password">>> {
    await sleep(80);
    requireUser();
    return db.users.map(toSessionUser);
  },
  async messages(channelId: string, cursor: string | null) {
    await sleep(80);
    requireUser();
    return pageMessages(channelId, cursor);
  },
  async sendMessage(channelId: string, body: string) {
    await sleep(80);
    const user = requireUser();
    if (!canSendMessage(user.role)) {
      throw new ApiError(403, "Guests cannot send messages");
    }
    const channel = db.channels.find((item) => item.id === channelId);
    if (!channel) throw new ApiError(404, "Channel not found");
    const clean = unescapePreview(sanitizeMessage(body));
    if (!clean) throw new ApiError(400, "Message is empty");
    const message: Message = {
      id: `msg-${crypto.randomUUID()}`,
      channelId,
      authorId: user.id,
      body: clean,
      createdAt: new Date().toISOString(),
    };
    db.messages.push(message);
    channel.unread = 0;
    return message;
  },
  async deleteMessage(messageId: string) {
    await sleep(80);
    const user = requireUser();
    const index = db.messages.findIndex((message) => message.id === messageId);
    if (index === -1) throw new ApiError(404, "Message not found");
    const message = db.messages[index];
    if (!canDeleteMessage(user.role, message.authorId === user.id)) {
      throw new ApiError(403, "Not allowed to delete this message");
    }
    db.messages.splice(index, 1);
    return { ok: true as const };
  },
};
