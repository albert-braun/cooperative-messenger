import type { Metadata } from "next";
import { MessengerShell } from "@/features/shell/messenger-shell";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

export default function AppPage() {
  return <MessengerShell />;
}
