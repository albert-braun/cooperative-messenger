export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-[var(--nx-muted)]">That route is not part of the Nexus workspace.</p>
      <a href="/" className="mt-3 text-sm text-[var(--nx-accent-2)] underline">
        Back to sign in
      </a>
    </div>
  );
}
