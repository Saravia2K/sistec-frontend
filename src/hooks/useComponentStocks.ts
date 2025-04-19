import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import type { TSupplier } from "@/lib/types";

export const fetchComponentStocks = (componentId: number) =>
  axios
    .get<TComponentPriceComparison>(`/components/${componentId}/stocks`)
    .then((res) => res.data);

export default function useComponentStock(componentId?: number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["components", componentId, "stocks"],
    queryFn: () => fetchComponentStocks(componentId),
    enabled: !!componentId,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });

  return {
    component: data,
    componentLoading: isLoading,
    errorLoadingComponent: isError,
    reloadComponent: refetch,
  };
}

type TComponentPriceComparison = {
  id: number;
  name: string;
  stocks: Array<{
    id: number;
    supplier: Pick<TSupplier, "id" | "name">;
    unitPrice: number;
  }>;
};
