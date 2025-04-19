import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { TSupplier } from "@/lib/types";

const fetchSuppliers = () =>
  axios.get<Omit<TSupplier, "purchases" | "stocks">[]>("/suppliers");

export default function useSuppliers() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["suppliers"],
    staleTime: Infinity,
    queryFn: fetchSuppliers,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    suppliers: data,
    suppliersLoading: isLoading,
    reloadSuppliers: refetch,
  };
}
