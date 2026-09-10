"use client";

import type { ReactNode } from "react";
import type { Channel, SessionUser, User } from "@/entities/types";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui/avatar";
import { StatusDot, presenceLabel } from "@/shared/ui/status-dot";
import { Skeleton } from "@/shared/ui/skeleton";

type ChannelSidebarProps = {
  workspaceName: string;
  channels: Channel[];
  users: Array<Omit<User, "password">>;
  channelId: string;
  currentUser?: SessionUser;
  loading?: boolean;
  onSelect: (id: string) => void;
};

function HashIcon() {
  return (
    <span aria-hidden="true" className="w-4 text-center text-[var(--nx-muted)]">
      #
    </span>
  );
}

export function ChannelSidebar({
  workspaceName,
  channels,
  users,
  channelId,
  currentUser,
  loading,
  onSelect,
}: ChannelSidebarProps) {
  const textChannels = channels.filter((channel) => channel.kind === "channel");
  const dms = channels.filter((channel) => channel.kind === "dm");

  return (
    <aside
      aria-label="Channels and direct messages"
      className="flex h-full w-[272px] shrink-0 flex-col border-r border-white/6 bg-[var(--nx-sidebar)]"
    >
      <div className="border-b border-white/6 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--nx-muted)]">
          Workspace
        </p>
        <h2 className="mt-1 truncate text-base font-semibold">{workspaceName}</h2>
      </div>
      <div className="nx-scroll flex-1 overflow-y-auto px-2 py-3">
        {loading ? (
          <div className="space-y-2 px-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
          </div>
        ) : (
          <>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--nx-muted)]">
              Channels
            </p>
            <ul className="space-y-0.5">
              {textChannels.map((channel) => (
                <li key={channel.id}>
                  <ChannelButton
                    active={channel.id === channelId}
                    unread={channel.unread}
                    onClick={() => onSelect(channel.id)}
                    label={`#${channel.name}`}
                  >
                    <HashIcon />
                    <span className="truncate">{channel.name}</span>
                  </ChannelButton>
                </li>
              ))}
            </ul>
            <p className="mt-4 px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--nx-muted)]">
              Direct messages
            </p>
            <ul className="space-y-0.5">
              {dms.map((channel) => {
                const otherId =
                  channel.memberIds.find((id) => id !== currentUser?.id) ??
                  channel.memberIds[0];
                const other = users.find((user) => user.id === otherId);
                return (
                  <li key={channel.id}>
                    <ChannelButton
                      active={channel.id === channelId}
                      unread={channel.unread}
                      onClick={() => onSelect(channel.id)}
                      label={`${channel.name}, ${other ? presenceLabel(other.presence) : "offline"}`}
                    >
                      <span className="relative">
                        <Avatar
                          initials={other?.initials ?? "?"}
                          accent={other?.accent ?? "#5c6478"}
                          size="sm"
                          className="h-6 w-6 rounded-lg text-[10px]"
                        />
                        {other ? (
                          <StatusDot
                            presence={other.presence}
                            className="absolute -right-0.5 -bottom-0.5 h-2 w-2"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
                      {other ? (
                        <span className="sr-only">{presenceLabel(other.presence)}</span>
                      ) : null}
                    </ChannelButton>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}

function ChannelButton({
  children,
  active,
  unread,
  onClick,
  label,
}: {
  children: ReactNode;
  active: boolean;
  unread: number;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
        active
          ? "bg-[var(--nx-accent)]/18 text-white"
          : "text-[#c9cfe0] hover:bg-white/5",
        unread > 0 && !active && "font-semibold text-white",
      )}
    >
      {children}
      {unread > 0 ? (
        <span className="ml-auto rounded-full bg-[var(--nx-accent)] px-1.5 text-[10px] font-bold text-white">
          {unread}
        </span>
      ) : null}
    </button>
  );
}
