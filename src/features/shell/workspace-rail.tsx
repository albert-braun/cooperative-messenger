"use client";

import type { SessionUser, Workspace } from "@/entities/types";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui/avatar";
import { StatusDot } from "@/shared/ui/status-dot";

type WorkspaceRailProps = {
  workspaces: Workspace[];
  workspaceId: string;
  currentUser?: SessionUser;
  onSelect: (id: string) => void;
  onProfile: () => void;
};

export function WorkspaceRail({
  workspaces,
  workspaceId,
  currentUser,
  onSelect,
  onProfile,
}: WorkspaceRailProps) {
  return (
    <nav
      aria-label="Workspaces"
      className="flex h-full w-[72px] shrink-0 flex-col items-center border-r border-white/6 bg-[var(--nx-rail)] py-3"
    >
      <ul className="flex flex-1 flex-col items-center gap-2">
        {workspaces.map((workspace) => {
          const active = workspace.id === workspaceId;
          return (
            <li key={workspace.id}>
              <button
                type="button"
                onClick={() => onSelect(workspace.id)}
                aria-current={active ? "page" : undefined}
                aria-label={workspace.name}
                title={workspace.name}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white transition",
                  active
                    ? "ring-2 ring-[var(--nx-accent)] ring-offset-2 ring-offset-[#07080c]"
                    : "opacity-80 hover:opacity-100 hover:rounded-xl",
                )}
                style={{ background: workspace.accent }}
              >
                {workspace.short}
                {active ? (
                  <span className="absolute -left-3 h-8 w-1 rounded-r-full bg-white" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {currentUser ? (
        <button
          type="button"
          onClick={onProfile}
          className="relative mt-auto rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nx-accent)]"
          aria-label={`${currentUser.name}, ${currentUser.role}. Open profile menu`}
        >
          <Avatar initials={currentUser.initials} accent={currentUser.accent} />
          <StatusDot
            presence={currentUser.presence}
            className="absolute -right-0.5 -bottom-0.5"
          />
        </button>
      ) : null}
    </nav>
  );
}
