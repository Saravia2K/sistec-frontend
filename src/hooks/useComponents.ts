import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TComponent } from "@/lib/types";

const fetchComponents = () => axios.get<TComponent[]>("/components");

export default function useComponents() {
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ["components"],
    staleTime: Infinity,
    queryFn: fetchComponents,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    components: data ?? [],
    componentsLoading: isLoading,
    errorLoadingComponents: isError,
    reloadComponents: refetch,
  };
}
