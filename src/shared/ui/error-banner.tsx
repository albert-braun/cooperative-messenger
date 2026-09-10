export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-4 my-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--nx-danger)]/30 bg-[var(--nx-danger)]/10 px-3 py-2 text-sm text-[#ffd0d5]"
    >
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/16"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
