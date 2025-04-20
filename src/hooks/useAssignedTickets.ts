import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TTicket } from "@/lib/types";
import { useAuth } from "./useAuth";

const fetchClientTickets = async (technicianId: number) =>
  axios.get<TTicket[]>(`/tickets/technician/${technicianId}`);

export default function useAssignedTickets(keep = false) {
  const { user } = useAuth();
  const technicianId = user?.technician?.id;

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", "assigned", technicianId],
    queryFn: () => fetchClientTickets(technicianId!),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    enabled: !!technicianId,
    staleTime: keep ? Infinity : 0,
    refetchOnMount: "always",
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTickets: refetch,
  };
}
