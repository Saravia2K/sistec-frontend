import axios from "@/lib/axios";
import { keepPreviousData } from "@tanstack/react-query";
import type { TTicket } from "@/lib/types";
import { useQueryWithInitialData } from "./useQueryWithInitialData";

export const fetchTickets = () => axios.get<TTicket[]>("/tickets").then((res) => res.data);

export default function useTickets(initialData?: TTicket[]) {
  const { data, isLoading, error, refetch } = useQueryWithInitialData({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    initialData,
  });

  return {
    tickets: data ?? [],
    isLoading,
    error,
    refetchTicket: refetch,
  };
}
