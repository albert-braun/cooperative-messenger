import type { Presence } from "@/entities/types";
import { cn } from "@/shared/lib/cn";

const colors: Record<Presence, string> = {
  online: "bg-[var(--nx-online)]",
  away: "bg-[var(--nx-away)]",
  offline: "bg-[#5c6478]",
};

export function StatusDot({
  presence,
  className,
}: {
  presence: Presence;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full ring-2 ring-[#10131a]",
        colors[presence],
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function presenceLabel(presence: Presence) {
  if (presence === "online") return "Online";
  if (presence === "away") return "Away";
  return "Offline";
}
