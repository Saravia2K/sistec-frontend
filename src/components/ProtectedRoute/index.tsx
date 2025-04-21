"use client";

import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, token } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    }
  }, [isAuthenticated, isHydrated, router, token]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) return <></>;
  return children;
}
