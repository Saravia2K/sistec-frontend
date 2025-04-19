import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async () => axios.get<TTicket[]>("/tickets");

export default function useTickets() {
  const {
    data: tickets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchClientTickets,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    refetchOnMount: true,
    select: (res) => res.data,
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTicket: refetch,
  };
}
