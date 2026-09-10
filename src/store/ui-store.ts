import { create } from "zustand";

type MobilePanel = "none" | "nav";

type UiState = {
  workspaceId: string;
  channelId: string;
  mobilePanel: MobilePanel;
  drafts: Record<string, string>;
  setWorkspace: (id: string, fallbackChannelId: string) => void;
  setChannel: (id: string) => void;
  setMobilePanel: (panel: MobilePanel) => void;
  setDraft: (channelId: string, value: string) => void;
  clearDraft: (channelId: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  workspaceId: "ws-hq",
  channelId: "ch-general",
  mobilePanel: "none",
  drafts: {},
  setWorkspace: (id, fallbackChannelId) =>
    set({
      workspaceId: id,
      channelId: fallbackChannelId,
      mobilePanel: "none",
    }),
  setChannel: (id) => set({ channelId: id, mobilePanel: "none" }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
  setDraft: (channelId, value) =>
    set((state) => ({ drafts: { ...state.drafts, [channelId]: value } })),
  clearDraft: (channelId) =>
    set((state) => {
      const next = { ...state.drafts };
      delete next[channelId];
      return { drafts: next };
    }),
}));
