"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "@/shared/api/client";
import { roleLabel } from "@/features/auth/permissions";
import { cn } from "@/shared/lib/cn";

const demos = [
  {
    userId: "u-alex",
    name: "Alex Rivera",
    role: "admin" as const,
    blurb: "Create, send, delete any message. Full workspace access.",
  },
  {
    userId: "u-maya",
    name: "Maya Chen",
    role: "member" as const,
    blurb: "Send messages and delete your own. Everyday teammate.",
  },
  {
    userId: "u-sam",
    name: "Sam Guest",
    role: "guest" as const,
    blurb: "Read-only. Composer locked — 403 on write APIs.",
  },
];

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("maya@nexus.dev");
  const [password, setPassword] = useState("nexus-demo");
  const login = useMutation({
    mutationFn: api.login,
    onSuccess: () => router.push("/app"),
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {demos.map((demo) => (
          <button
            key={demo.userId}
            type="button"
            onClick={() => login.mutate({ userId: demo.userId })}
            className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left transition hover:border-[var(--nx-accent)]/50 hover:bg-white/7"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-semibold">{demo.name}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  demo.role === "admin" && "bg-[var(--nx-accent)]/20 text-[#d0cbff]",
                  demo.role === "member" && "bg-[var(--nx-accent-2)]/15 text-[#b6f3e6]",
                  demo.role === "guest" && "bg-white/8 text-[var(--nx-muted)]",
                )}
              >
                {roleLabel(demo.role)}
              </span>
            </span>
            <span className="mt-1 block text-sm text-[var(--nx-muted)]">
              {demo.blurb}
            </span>
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/8 p-4">
        <p className="text-sm font-medium">Or sign in with email</p>
        <label className="block text-xs text-[var(--nx-muted)]">
          Email
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[var(--nx-accent)]"
          />
        </label>
        <label className="block text-xs text-[var(--nx-muted)]">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[var(--nx-accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-xl bg-[var(--nx-accent)] py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-[11px] text-[var(--nx-muted)]">
          Demo password for every account: <code>nexus-demo</code>
        </p>
        {login.isError ? (
          <p role="alert" className="text-sm text-[var(--nx-danger)]">
            {login.error.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
