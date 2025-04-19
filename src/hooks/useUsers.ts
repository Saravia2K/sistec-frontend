import axios from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TClient } from "@/lib/types";

const fetchUsers = () => axios.get<TClient[]>("/clients");

export default function useUsers() {
  const {
    isLoading,
    data = [],
    refetch,
  } = useQuery({
    queryKey: ["users"],
    staleTime: Infinity,
    queryFn: fetchUsers,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  return {
    users: data,
    usersLoading: isLoading,
    reloadUsers: refetch,
  };
}
