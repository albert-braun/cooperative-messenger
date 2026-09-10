"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function StaticHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC !== "1") return;
    if (window.localStorage.getItem("nx_session_user")) {
      router.replace("/app");
    }
  }, [router]);

  return null;
}
