// hooks/useClientDashboard.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";

interface Ticket {
  id: number;
  requestDate: string;
  status: "pending" | "inProgress" | "completed";
  deviceType: {
    name: string;
  };
  assignedTechnician?: {
    user: {
      name: string;
    };
  };
}

interface DashboardData {
  totalTickets: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  recentRequests: Ticket[];
}

const fetchClientDashboard = (token: string) =>
  axios.get<DashboardData>(`${API_URL}/dashboard/client`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default function useClientDashboard() {
  const { token } = useAuth();

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: () => fetchClientDashboard(token || ""),
    enabled: !!token, // Solo ejecuta si hay token
    select: (response) => response.data,
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
  };
}
