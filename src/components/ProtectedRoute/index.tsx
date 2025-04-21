"use client";

import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, token, user } = useAuth();
  const shouldBeWelcome = pathname != "/bienvenido" && user?.firstLogin;
  const [isCorrectDashboard, setIsCorrectDashboard] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
      if (shouldBeWelcome) {
        router.push("/bienvenido");
        return;
      }

      const prefix = pathname.split("/").filter(Boolean)[0];
      const isClient = user?.customer != null;
      const isTechnician = user?.technician != null;

      if (isClient && prefix != "cliente") router.push("/cliente");
      else if (isTechnician && prefix != "soporte") router.push("/soporte");
      else if (!isClient && !isTechnician && prefix != "admin") router.push("/admin");
      else setIsCorrectDashboard(true);
    }
  }, [isAuthenticated, isHydrated, router, token, shouldBeWelcome, user, pathname]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || shouldBeWelcome || !isCorrectDashboard) return <></>;

  return children;
}
