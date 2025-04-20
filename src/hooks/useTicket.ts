import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async (id: number) =>
  axios.get<TTicket>(`/tickets/${id}`);

export default function useTicket(id: number) {
  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", id],
    queryFn: () => fetchClientTickets(id!),
    enabled: !!id,
    staleTime: Infinity,
    select: (res) => res.data,
    refetchOnMount: false,
  });

  return {
    ticket,
    isLoading,
    error,
    refetchTicket: refetch,
  };
}
