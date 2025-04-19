import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

export const fetchMostUsedComponents = () =>
  axios
    .get<TMostUsedComponent[]>("/reports/components/most-used")
    .then((res) => res.data);

export default function useMostUsedComponents() {
  const { data, isLoading, refetch, isError } = useQuery({
    queryFn: fetchMostUsedComponents,
    queryKey: ["components", "most-used"],
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });

  return {
    components: data ?? [],
    componentsLoading: isLoading,
    reloadComponents: refetch,
    errorLoadingComponents: isError,
  };
}

export type TMostUsedComponent = {
  component_id: number;
  component_name: string;
  times_used: number;
  total_units_used: number;
};
