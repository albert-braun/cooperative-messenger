"use client";

import type { Channel, SessionUser } from "@/entities/types";
import { canSendMessage, roleLabel } from "@/features/auth/permissions";
import { cn } from "@/shared/lib/cn";

type ChatHeaderProps = {
  channel?: Channel;
  memberCount: number;
  currentUser?: SessionUser;
  onOpenNav: () => void;
};

export function ChatHeader({
  channel,
  memberCount,
  currentUser,
  onOpenNav,
}: ChatHeaderProps) {
  const title = channel
    ? channel.kind === "channel"
      ? `#${channel.name}`
      : channel.name
    : "Select a channel";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 bg-[var(--nx-panel)]/90 px-3 backdrop-blur md:px-5">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/8 md:hidden"
        onClick={onOpenNav}
        aria-label="Open workspace navigation"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-semibold">{title}</h1>
        <p className="truncate text-xs text-[var(--nx-muted)]">
          {channel?.topic ?? "Pick a conversation"}
          {memberCount ? ` · ${memberCount} people` : ""}
        </p>
      </div>
      {currentUser ? (
        <p
          className={cn(
            "hidden rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide sm:block",
            currentUser.role === "admin" && "bg-[var(--nx-accent)]/20 text-[#d0cbff]",
            currentUser.role === "member" && "bg-[var(--nx-accent-2)]/15 text-[#b6f3e6]",
            currentUser.role === "guest" && "bg-white/8 text-[var(--nx-muted)]",
          )}
        >
          {roleLabel(currentUser.role)}
          {!canSendMessage(currentUser.role) ? " · read only" : ""}
        </p>
      ) : null}
    </header>
  );
}
