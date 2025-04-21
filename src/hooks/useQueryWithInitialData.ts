"use client";

import { useEffect, useRef } from "react";
import {
  useQuery,
  useQueryClient,
  QueryObserverOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export function useQueryWithInitialData<
  TQueryFnDataOverride = unknown,
  TErrorOverride = Error,
  TDataOverride = TQueryFnDataOverride
>(
  options: Omit<
    QueryObserverOptions<TQueryFnDataOverride, TErrorOverride, TDataOverride>,
    "initialData"
  > & {
    initialData?: TQueryFnDataOverride | (() => TQueryFnDataOverride);
  }
): UseQueryResult<TDataOverride, TErrorOverride> {
  const queryClient = useQueryClient();
  const initialDataRef = useRef(options.initialData);

  useEffect(() => {
    // Solo actualizamos si initialData realmente cambió
    if (options.initialData !== undefined && options.initialData !== initialDataRef.current) {
      initialDataRef.current = options.initialData;
      queryClient.setQueryData(
        options.queryKey,
        typeof options.initialData === "function"
          ? (options.initialData as () => TQueryFnDataOverride)()
          : options.initialData
      );
    }
  }, [options.initialData, queryClient, options.queryKey]);

  return useQuery(options);
}
