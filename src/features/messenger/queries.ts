"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { homePath } from "@/shared/lib/paths";

export const queryKeys = {
  me: ["me"] as const,
  workspaces: ["workspaces"] as const,
  users: ["users"] as const,
  channels: (workspaceId: string) => ["channels", workspaceId] as const,
  messages: (channelId: string) => ["messages", channelId] as const,
};

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: api.me,
  });
}

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces,
    queryFn: api.workspaces,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: api.users,
  });
}

export function useChannels(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.channels(workspaceId),
    queryFn: () => api.channels(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      client.clear();
      window.location.href = homePath();
    },
  });
}
