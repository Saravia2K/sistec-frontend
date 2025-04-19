import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { TTicket } from "@/lib/types";
import { useAuth } from "./useAuth";

const fetchClientTickets = async (technicianId: number) =>
  axios.get<TTicket[]>(`/tickets/technician/${technicianId}`);

export default function useAssignedTickets() {
  const { user, token } = useAuth();
  const technicianId = user?.technician?.id;

  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tickets", "assigned", technicianId],
    queryFn: () => fetchClientTickets(technicianId!),
    enabled: !!technicianId && !!token,
    select: (res) => res.data,
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTickets: refetch,
  };
}
