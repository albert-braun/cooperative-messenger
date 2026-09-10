import type {
  Channel,
  Message,
  PageResult,
  SessionUser,
  User,
  Workspace,
} from "@/entities/types";
import { localApi } from "@/shared/api/local";
import { ApiError } from "@/shared/api/errors";

export { ApiError };

const useLocal = process.env.NEXT_PUBLIC_STATIC === "1";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      message = response.statusText || message;
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

const remoteApi = {
  me: () => request<SessionUser>("/api/auth/me"),
  login: (payload: { userId?: string; email?: string; password?: string }) =>
    request<SessionUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  workspaces: () => request<Workspace[]>("/api/workspaces"),
  channels: (workspaceId: string) =>
    request<Channel[]>(`/api/channels?workspaceId=${encodeURIComponent(workspaceId)}`),
  users: () => request<Omit<User, "password">[]>("/api/users"),
  messages: (channelId: string, cursor: string | null) => {
    const params = new URLSearchParams({ channelId, limit: "24" });
    if (cursor) params.set("before", cursor);
    return request<PageResult<Message>>(`/api/messages?${params.toString()}`);
  },
  sendMessage: (channelId: string, body: string) =>
    request<Message>("/api/messages", {
      method: "POST",
      body: JSON.stringify({ channelId, body }),
    }),
  deleteMessage: (messageId: string) =>
    request<{ ok: true }>(`/api/messages/${messageId}`, { method: "DELETE" }),
};

export const api = useLocal ? localApi : remoteApi;
