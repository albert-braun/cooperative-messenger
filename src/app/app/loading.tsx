export default function AppLoading() {
  return (
    <div className="flex h-dvh bg-[var(--background)]">
      <div className="hidden w-[72px] border-r border-white/6 bg-[var(--nx-rail)] md:block" />
      <div className="hidden w-[272px] border-r border-white/6 bg-[var(--nx-sidebar)] md:block" />
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--nx-muted)]">
        Opening workspace…
      </div>
    </div>
  );
}
