import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface HighPriorityTicket {
  id: number;
  requestDate: string;
}

interface IObjectNumberProp {
  [k: string]: number;
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
  commonFailures: IObjectNumberProp;
  avgRepairTimes: IObjectNumberProp;
  highPriorityTickets: HighPriorityTicket[];
}

const fetchAdminDashboard = () => axios.get<DashboardData>("/dashboard/admin");

export default function useAdminDashboard() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: fetchAdminDashboard,
    select: (res) => res.data,
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
  };
}
