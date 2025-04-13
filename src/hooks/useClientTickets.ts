// hooks/useClientTicket.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async (customerId: number, token: string) => {
  const response = await axios.get<TTicket[]>(
    `${API_URL}/tickets/customer/${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default function useClientTicket() {
  const { user, token } = useAuth();
  const customerId = user?.id;

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", "customer", customerId],
    queryFn: () => fetchClientTickets(customerId!, token!),
    enabled: !!customerId && !!token, // Solo se ejecuta si hay customerId y token
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTickets: refetch,
  };
}
