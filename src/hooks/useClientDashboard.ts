import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

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

export const fetchClientDashboard = () =>
  axios.get<DashboardData>("/dashboard/client");

export default function useClientDashboard() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["dashboard", "client"],
    queryFn: fetchClientDashboard,
    select: (response) => response.data,
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
  };
}
