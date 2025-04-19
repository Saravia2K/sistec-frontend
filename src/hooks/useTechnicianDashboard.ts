// hooks/useTechnicianDashboard.ts
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

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

const fetchTechnicianDashboard = () =>
  axios.get<TechnicianDashboardData>("/dashboard/technician");

export default function useTechnicianDashboard() {
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["dashboard", "support"],
    queryFn: fetchTechnicianDashboard,
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
