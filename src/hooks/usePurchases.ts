import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TPurchase } from "@/lib/types";

export type TPurchaseResponseItem = TPurchase & {
  used: boolean;
};
const fetchPurchases = () =>
  axios.get<TPurchaseResponseItem[]>(`${API_URL}/purchases`);

export default function usePurchases() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["purchases"],
    staleTime: Infinity,
    queryFn: fetchPurchases,
    placeholderData: keepPreviousData,
  });

  return {
    purchases: data?.data,
    purchasesLoading: isLoading,
    reloadPurchases: refetch,
  };
}
