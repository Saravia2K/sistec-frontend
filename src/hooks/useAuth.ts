// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./useLoggedUser";

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const state = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...state,
    isHydrated,
  };
};
