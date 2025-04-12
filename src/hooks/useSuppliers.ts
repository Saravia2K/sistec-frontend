import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TSupplier } from "@/lib/types";

const fetchSuppliers = () =>
  axios.get<Omit<TSupplier, "purchases" | "stocks">[]>(`${API_URL}/suppliers`);

export default function useSuppliers() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["suppliers"],
    staleTime: Infinity,
    queryFn: fetchSuppliers,
    placeholderData: keepPreviousData,
  });

  return {
    suppliers: data?.data,
    suppliersLoading: isLoading,
    reloadSuppliers: refetch,
  };
}
