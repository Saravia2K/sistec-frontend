import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

const fetchComponentDemand = () =>
  axios.get<DemandData>("/reports/component-demand").then((res) => res.data);

export const useComponentDemand = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["components", "demand"],
    queryFn: fetchComponentDemand,
    staleTime: Infinity,
    refetchOnMount: "always",
  });

  return {
    components: data ?? [],
    componentsLoading: isLoading,
    reloadComponents: refetch,
  };
};

type DemandData = {
  historical: Array<{
    id: number;
    component_name: string;
    month: string;
    units_used: number;
  }>;
  projection: Array<{
    id: number;
    component_name: string;
    month: string;
    projected_units: number;
  }>;
  stock: Array<{
    componentId: number;
    stock: number;
    minimumStock: number;
    component: {
      name: string;
    };
  }>;
};
