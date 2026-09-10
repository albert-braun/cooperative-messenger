"use client";

import { useEffect, useMemo, useState } from "react";
import { ChatHeader } from "@/features/chat/chat-header";
import { Composer } from "@/features/chat/composer";
import { MessageList } from "@/features/chat/message-list";
import {
  useChannels,
  useLogout,
  useMe,
  useUsers,
  useWorkspaces,
} from "@/features/messenger/queries";
import { ChannelSidebar } from "@/features/shell/channel-sidebar";
import { WorkspaceRail } from "@/features/shell/workspace-rail";
import { roleLabel } from "@/features/auth/permissions";
import { cn } from "@/shared/lib/cn";
import { homePath } from "@/shared/lib/paths";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { useUiStore } from "@/store/ui-store";

export function MessengerShell() {
  const me = useMe();
  const workspaces = useWorkspaces();
  const users = useUsers();
  const logout = useLogout();
  const workspaceId = useUiStore((state) => state.workspaceId);
  const channelId = useUiStore((state) => state.channelId);
  const mobilePanel = useUiStore((state) => state.mobilePanel);
  const setWorkspace = useUiStore((state) => state.setWorkspace);
  const setChannel = useUiStore((state) => state.setChannel);
  const setMobilePanel = useUiStore((state) => state.setMobilePanel);
  const [profileOpen, setProfileOpen] = useState(false);

  const channels = useChannels(workspaceId);
  const workspace = workspaces.data?.find((item) => item.id === workspaceId);
  const channelList = channels.data ?? [];
  const activeChannel = channelList.find((item) => item.id === channelId);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC !== "1") return;
    if (me.isError) {
      window.location.href = homePath();
    }
  }, [me.isError]);

  useEffect(() => {
    if (!channelList.length) return;
    if (!channelList.some((item) => item.id === channelId)) {
      setChannel(channelList[0].id);
    }
  }, [channelList, channelId, setChannel]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobilePanel("none");
        setProfileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMobilePanel]);

  const memberCount = useMemo(
    () => activeChannel?.memberIds.length ?? 0,
    [activeChannel],
  );

  function selectWorkspace(id: string) {
    const fallback = id === "ws-lab" ? "ch-design" : "ch-general";
    setWorkspace(id, fallback);
  }

  const nav = (
    <>
      <WorkspaceRail
        workspaces={workspaces.data ?? []}
        workspaceId={workspaceId}
        currentUser={me.data}
        onSelect={selectWorkspace}
        onProfile={() => setProfileOpen((value) => !value)}
      />
      <ChannelSidebar
        workspaceName={workspace?.name ?? "Nexus"}
        channels={channelList}
        users={users.data ?? []}
        channelId={channelId}
        currentUser={me.data}
        loading={channels.isLoading}
        onSelect={setChannel}
      />
    </>
  );

  return (
    <div className="relative flex h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#message-input"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-[var(--nx-accent)] focus:px-3 focus:py-2"
      >
        Skip to message composer
      </a>
      <div className="hidden md:flex">{nav}</div>
      {mobilePanel === "nav" ? (
        <div className="md:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setMobilePanel("none")}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Workspace navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-[min(100%,344px)] shadow-2xl"
          >
            {nav}
          </div>
        </div>
      ) : null}
      <section className="relative flex min-w-0 flex-1 flex-col bg-[var(--nx-panel)]">
        {me.isError ? (
          <ErrorBanner
            message="Session expired or the API is unavailable."
            onRetry={() => void me.refetch()}
          />
        ) : null}
        <ChatHeader
          channel={activeChannel}
          memberCount={memberCount}
          currentUser={me.data}
          onOpenNav={() => setMobilePanel("nav")}
        />
        {activeChannel ? (
          <MessageList
            channelId={activeChannel.id}
            users={users.data ?? []}
            currentUser={me.data}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-[var(--nx-muted)]">
            Loading conversation…
          </div>
        )}
        <Composer channel={activeChannel} currentUser={me.data} />
        {profileOpen && me.data ? (
          <div
            className={cn(
              "absolute z-30 w-64 rounded-2xl border border-white/10 bg-[#12151d] p-3 shadow-2xl",
              "bottom-20 left-3 md:bottom-4 md:left-[84px]",
            )}
            role="menu"
            aria-label="Profile"
          >
            <p className="text-sm font-semibold">{me.data.name}</p>
            <p className="text-xs text-[var(--nx-muted)]">{me.data.email}</p>
            <p className="mt-2 text-xs text-[#c9cfe0]">
              {me.data.title} · {roleLabel(me.data.role)}
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={() => logout.mutate()}
              className="mt-3 w-full rounded-xl bg-white/8 px-3 py-2 text-left text-sm hover:bg-white/12"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
