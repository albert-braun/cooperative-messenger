import { cn } from "@/shared/lib/cn";

type AvatarProps = {
  initials: string;
  accent: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export function Avatar({ initials, accent, size = "md", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
        sizes[size],
        className,
      )}
      style={{ background: accent }}
    >
      {initials}
    </span>
  );
}
