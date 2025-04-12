import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/consts";
import { TClient } from "@/lib/types";

const fetchUsers = () => axios.get<TClient[]>(`${API_URL}/clients`);

export default function useUsers() {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["users"],
    staleTime: Infinity,
    queryFn: fetchUsers,
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.data,
    usersLoading: isLoading,
    reloadUsers: refetch,
  };
}
