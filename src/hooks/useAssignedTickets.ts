// hooks/useClientTicket.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";
import { TTicket } from "@/lib/types";

const fetchClientTickets = async (technicianId: number, token: string) => {
  const response = await axios.get<TTicket[]>(
    `${API_URL}/tickets/technician/${technicianId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

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
    queryFn: () => fetchClientTickets(technicianId!, token!),
    enabled: !!technicianId && !!token, // Solo se ejecuta si hay customerId y token
  });

  return {
    tickets,
    isLoading,
    error,
    refetchTickets: refetch,
  };
}
