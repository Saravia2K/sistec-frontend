// hooks/useClientTicket.ts
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { TTicket } from "@/lib/types";

export const fetchClientTickets = async (customerId: number) =>
  axios.get<TTicket[]>(`/tickets/customer/${customerId}`);

export default function useClientTicket() {
  const { user } = useAuth();
  const customerId = user?.customer.id;

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", "customer", customerId],
    queryFn: () => fetchClientTickets(customerId!),
    enabled: !!customerId,
    select: (res) => res.data,
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTickets: refetch,
  };
}
