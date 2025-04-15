// hooks/useTechnicianDashboard.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";

interface RecentAssignedTicket {
  id: number;
  customerName: string;
  requestDate: string;
  status: "pending" | "inProgress" | "completed";
  priority: "low" | "medium" | "high";
}

interface TechnicianDashboardData {
  totalTickets: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  recentAssignedTickets: RecentAssignedTicket[];
}

const fetchTechnicianDashboard = (token: string) =>
  axios.get<TechnicianDashboardData>(`${API_URL}/dashboard/technician`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default function useTechnicianDashboard() {
  const { token } = useAuth();

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["technicianDashboard"],
    queryFn: () => fetchTechnicianDashboard(token || ""),
    enabled: !!token,
    select: (response) => response.data,
  });

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
