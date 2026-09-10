"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import type { Message, SessionUser, User } from "@/entities/types";
import { MessageItem } from "@/features/chat/message-item";
import { queryKeys } from "@/features/messenger/queries";
import { api } from "@/shared/api/client";
import { formatDay, sameMinuteWindow } from "@/shared/lib/dates";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Skeleton } from "@/shared/ui/skeleton";

type MessageListProps = {
  channelId: string;
  users: Array<Omit<User, "password">>;
  currentUser?: SessionUser;
};

export function MessageList({ channelId, users, currentUser }: MessageListProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const initialReady = useRef(false);
  const client = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: queryKeys.messages(channelId),
    queryFn: ({ pageParam }) => api.messages(channelId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const messages = useMemo(() => {
    if (!query.data) return [];
    return [...query.data.pages].reverse().flatMap((page) => page.items);
  }, [query.data]);

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    initialReady.current = false;
    stickToBottom.current = true;
  }, [channelId]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || !lastMessage) return;
    if (stickToBottom.current || lastMessage.authorId === currentUser?.id) {
      node.scrollTop = node.scrollHeight;
      initialReady.current = true;
    }
  }, [lastMessage?.id, channelId, currentUser?.id, lastMessage]);

  useEffect(() => {
    const root = scrollerRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !initialReady.current ||
          !entries[0]?.isIntersecting ||
          !query.hasNextPage ||
          query.isFetchingNextPage
        ) {
          return;
        }
        const previousHeight = root.scrollHeight;
        void query.fetchNextPage().then(() => {
          requestAnimationFrame(() => {
            root.scrollTop = root.scrollHeight - previousHeight;
          });
        });
      },
      { root, threshold: 0.1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage, channelId]);

  const remove = useMutation({
    mutationFn: api.deleteMessage,
    onSuccess: (_data, messageId) => {
      client.setQueryData(queryKeys.messages(channelId), (old: typeof query.data) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== messageId),
          })),
        };
      });
    },
  });

  const userById = useMemo(() => {
    return new Map(users.map((user) => [user.id, user]));
  }, [users]);

  return (
    <div
      ref={scrollerRef}
      className="nx-scroll flex-1 overflow-y-auto px-2 py-3 pb-5 md:px-4"
      onScroll={(event) => {
        const node = event.currentTarget;
        stickToBottom.current =
          node.scrollHeight - node.scrollTop - node.clientHeight < 80;
      }}
      aria-live="polite"
      aria-relevant="additions"
      tabIndex={0}
    >
      <div ref={sentinelRef} className="h-4" />
      {query.isFetchingNextPage ? (
        <p className="pb-3 text-center text-xs text-[var(--nx-muted)]">
          Loading earlier messages…
        </p>
      ) : null}
      {query.isLoading ? (
        <div className="space-y-4 px-2 pt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {query.isError ? (
        <ErrorBanner
          message={query.error.message || "Could not load messages"}
          onRetry={() => void query.refetch()}
        />
      ) : null}
      {messages.map((message, index) => {
        const previous = messages[index - 1] as Message | undefined;
        const compact = Boolean(
          previous &&
            previous.authorId === message.authorId &&
            sameMinuteWindow(previous.createdAt, message.createdAt),
        );
        const showDay =
          !previous || formatDay(previous.createdAt) !== formatDay(message.createdAt)
            ? formatDay(message.createdAt)
            : null;
        return (
          <MessageItem
            key={message.id}
            message={message}
            author={userById.get(message.authorId)}
            compact={compact}
            showDay={showDay}
            currentUser={currentUser}
            onDelete={(id) => remove.mutate(id)}
          />
        );
      })}
    </div>
  );
}
