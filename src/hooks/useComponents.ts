import axios from "@/lib/axios";
import { keepPreviousData } from "@tanstack/react-query";
import { TComponent } from "@/lib/types";
import { useQueryWithInitialData } from "./useQueryWithInitialData";

// 2. Función para fetch de datos
export const fetchComponents = () => axios.get<TComponent[]>("/components").then((res) => res.data);

// 3. Hook personalizado para componentes
export default function useComponents(initialData?: TComponent[]) {
  const { data, isLoading, isError, refetch } = useQueryWithInitialData({
    queryKey: ["components"],
    queryFn: fetchComponents,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    initialData,
  });

  return {
    components: data ?? [],
    componentsLoading: isLoading,
    errorLoadingComponents: isError,
    reloadComponents: refetch,
  };
}
