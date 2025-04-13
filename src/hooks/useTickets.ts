// hooks/useClientTicket.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async () => {
  const response = await axios.get<TTicket[]>(`${API_URL}/tickets`);
  return response.data;
};

export default function useTickets() {
  const {
    data: tickets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchClientTickets,
    staleTime: 0,
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTicket: refetch,
  };
}
