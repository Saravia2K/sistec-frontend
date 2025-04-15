import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { TComponentStock } from "@/lib/types";

const fetchAvailableComponents = () =>
  axios.get<TComponentStock[]>("/component-stock").then(({ data }) => data);

export default function useAvailableComponents() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["components", "stock"],
    queryFn: fetchAvailableComponents,
    placeholderData: keepPreviousData,
  });

  return {
    components: data,
    componentsLoading: isLoading,
    reloadComponents: refetch,
  };
}
