"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, type FormEvent, type KeyboardEvent } from "react";
import type { Channel, Message, SessionUser } from "@/entities/types";
import { canSendMessage } from "@/features/auth/permissions";
import { queryKeys } from "@/features/messenger/queries";
import { api } from "@/shared/api/client";
import { sanitizeMessage, unescapePreview } from "@/shared/lib/sanitize";
import { useUiStore } from "@/store/ui-store";

const EMOJIS = ["👍", "🔥", "✅", "👀", "🎉", "💡"];

type ComposerProps = {
  channel?: Channel;
  currentUser?: SessionUser;
};

export function Composer({ channel, currentUser }: ComposerProps) {
  const client = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelId = channel?.id ?? "";
  const draft = useUiStore((state) => state.drafts[channelId] ?? "");
  const setDraft = useUiStore((state) => state.setDraft);
  const clearDraft = useUiStore((state) => state.clearDraft);
  const allowed = currentUser ? canSendMessage(currentUser.role) : false;

  const send = useMutation({
    mutationFn: (body: string) => api.sendMessage(channelId, body),
    onMutate: async (body) => {
      await client.cancelQueries({ queryKey: queryKeys.messages(channelId) });
      const previous = client.getQueryData(queryKeys.messages(channelId));
      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        channelId,
        authorId: currentUser?.id ?? "me",
        body,
        createdAt: new Date().toISOString(),
      };
      client.setQueryData(
        queryKeys.messages(channelId),
        (old: { pages: Array<{ items: Message[]; nextCursor: string | null }>; pageParams: unknown[] } | undefined) => {
          if (!old) {
            return { pages: [{ items: [optimistic], nextCursor: null }], pageParams: [null] };
          }
          const pages = [...old.pages];
          const first = pages[0];
          pages[0] = { ...first, items: [...first.items, optimistic] };
          return { ...old, pages };
        },
      );
      return { previous };
    },
    onError: (_error, _body, context) => {
      if (context?.previous) {
        client.setQueryData(queryKeys.messages(channelId), context.previous);
      }
    },
    onSuccess: (message) => {
      client.setQueryData(
        queryKeys.messages(channelId),
        (old: { pages: Array<{ items: Message[]; nextCursor: string | null }>; pageParams: unknown[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    items: page.items.map((item) =>
                      item.id.startsWith("optimistic-") ? message : item,
                    ),
                  }
                : page,
            ),
          };
        },
      );
    },
  });

  function submit() {
    if (!allowed || !channelId) return;
    const next = unescapePreview(sanitizeMessage(draft));
    if (!next) return;
    clearDraft(channelId);
    send.mutate(next);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  const placeholder = !channel
    ? "Select a channel first"
    : allowed
      ? `Message ${channel.kind === "channel" ? "#" : ""}${channel.name}`
      : "Guest accounts are read-only";

  return (
    <form
      onSubmit={onSubmit}
      className="shrink-0 border-t border-white/6 bg-[var(--nx-panel)] px-3 py-3 md:px-5"
    >
      <div className="rounded-2xl border border-white/8 bg-[var(--nx-elevated)] focus-within:border-[var(--nx-accent)]/70">
        <label className="sr-only" htmlFor="message-input">
          Message
        </label>
        <textarea
          id="message-input"
          ref={textareaRef}
          rows={1}
          disabled={!allowed || !channel}
          value={draft}
          onChange={(event) => setDraft(channelId, event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={2000}
          className="max-h-40 min-h-[44px] w-full resize-none bg-transparent px-4 pt-3 text-[15px] text-white outline-none placeholder:text-[var(--nx-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex items-center gap-1 px-2 pb-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              disabled={!allowed}
              className="rounded-lg px-1.5 py-1 text-sm hover:bg-white/8 disabled:opacity-40"
              onClick={() => setDraft(channelId, `${draft}${emoji}`)}
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <p className="ml-auto hidden text-[11px] text-[var(--nx-muted)] sm:block">
            Enter to send · Shift+Enter for a new line
          </p>
          <button
            type="submit"
            disabled={!allowed || !draft.trim() || send.isPending}
            className="ml-2 mr-1 rounded-xl bg-[var(--nx-accent)] px-3.5 py-1.5 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
      {send.isError ? (
        <p role="alert" className="mt-2 text-xs text-[var(--nx-danger)]">
          {send.error.message} — your draft was restored if the optimistic update rolled back.
        </p>
      ) : null}
    </form>
  );
}
