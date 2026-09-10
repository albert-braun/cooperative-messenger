"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Something broke after render</h1>
      <p className="max-w-md text-sm text-[var(--nx-muted)]">
        {error.message || "Unexpected client error. This boundary keeps the rest of the app recoverable."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-[var(--nx-accent)] px-4 py-2 text-sm font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
