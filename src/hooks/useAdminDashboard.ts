// hooks/useAdminDashboard.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { useAuth } from "./useAuth";

interface HighPriorityTicket {
  id: number;
  requestDate: string;
}

interface AvgRepairTimes {
  [key: string]: number; // Ejemplo: { "1 día": 5, "2 días": 3 }
}

interface CommonFailures {
  [failureName: string]: number; // Ejemplo: { "Pantalla rota": 15, "Batería defectuosa": 8 }
}

interface LowStockComponent {
  id: number;
  name: string;
  currentStock: number;
  minStock: number;
  supplier: string;
}

interface DashboardData {
  totalTickets: number;
  byStatus: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  lowStockComponents: LowStockComponent[];
  commonFailures: CommonFailures;
  avgRepairTimes: AvgRepairTimes;
  highPriorityTickets: HighPriorityTicket[];
}

const fetchAdminDashboard = (token: string) =>
  axios.get<DashboardData>(`${API_URL}/dashboard/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default function useAdminDashboard() {
  const { token } = useAuth();

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => fetchAdminDashboard(token || ""),
    enabled: !!token,
    select: (response) => response.data,
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
  };
}
