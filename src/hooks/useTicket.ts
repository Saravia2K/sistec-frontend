// hooks/useClientTicket.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async (id: number) => {
  const response = await axios.get<TTicket>(`${API_URL}/tickets/${id}`);
  return response.data;
};

export default function useTicket(id: number) {
  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", id],
    queryFn: () => fetchClientTickets(id!),
    enabled: !!id, // Solo se ejecuta si hay customerId y token,
    staleTime: 0,
  });

  return {
    ticket,
    isLoading,
    error,
    refetchTicket: refetch,
  };
}
