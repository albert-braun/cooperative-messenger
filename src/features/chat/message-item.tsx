"use client";

import { memo } from "react";
import type { Message, SessionUser, User } from "@/entities/types";
import { canDeleteMessage } from "@/features/auth/permissions";
import { formatTime } from "@/shared/lib/dates";
import { Avatar } from "@/shared/ui/avatar";

type MessageItemProps = {
  message: Message;
  author?: Omit<User, "password">;
  compact?: boolean;
  showDay?: string | null;
  currentUser?: SessionUser;
  onDelete: (id: string) => void;
};

function MessageItemInner({
  message,
  author,
  compact,
  showDay,
  currentUser,
  onDelete,
}: MessageItemProps) {
  const canDelete = currentUser
    ? canDeleteMessage(currentUser.role, currentUser.id === message.authorId)
    : false;

  return (
    <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 72px" }}>
      {showDay ? (
        <div className="relative my-4 flex items-center px-2">
          <span className="h-px flex-1 bg-white/8" />
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--nx-muted)]">
            {showDay}
          </span>
          <span className="h-px flex-1 bg-white/8" />
        </div>
      ) : null}
      <article
        className="group relative grid grid-cols-[36px_1fr] gap-x-3 rounded-xl px-2 py-0.5 hover:bg-white/4"
        aria-label={`${author?.name ?? "Unknown"}, ${formatTime(message.createdAt)}`}
      >
        {compact ? (
          <span className="pt-1.5 text-center text-[10px] text-transparent group-hover:text-[var(--nx-muted)]">
            {formatTime(message.createdAt)}
          </span>
        ) : (
          <Avatar
            initials={author?.initials ?? "?"}
            accent={author?.accent ?? "#5c6478"}
            size="sm"
            className="mt-1"
          />
        )}
        <div className="min-w-0">
          {compact ? null : (
            <header className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">
                {author?.name ?? "Unknown"}
              </span>
              <time
                dateTime={message.createdAt}
                className="text-[11px] text-[var(--nx-muted)]"
              >
                {formatTime(message.createdAt)}
              </time>
            </header>
          )}
          <p className="whitespace-pre-wrap break-words text-[15px] leading-6 text-[#dde2f0]">
            {message.body}
          </p>
        </div>
        {canDelete ? (
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="absolute top-1 right-2 hidden rounded-md px-2 py-1 text-[11px] text-[#ffb4bc] hover:bg-[var(--nx-danger)]/15 group-hover:block"
            aria-label="Delete message"
          >
            Delete
          </button>
        ) : null}
      </article>
    </div>
  );
}

export const MessageItem = memo(MessageItemInner);
