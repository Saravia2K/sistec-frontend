import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TPurchase } from "@/lib/types";

export type TPurchaseResponseItem = TPurchase & {
  used: boolean;
};
const fetchPurchases = () => axios.get<TPurchaseResponseItem[]>("/purchases");

export default function usePurchases() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["purchases"],
    staleTime: Infinity,
    queryFn: fetchPurchases,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    purchases: data,
    purchasesLoading: isLoading,
    reloadPurchases: refetch,
  };
}
