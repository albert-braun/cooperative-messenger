import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessengerShell } from "@/features/shell/messenger-shell";
import { getCurrentUser } from "@/server/session";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

export default async function AppPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return <MessengerShell />;
}
