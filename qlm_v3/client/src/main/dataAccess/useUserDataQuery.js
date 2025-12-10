import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useUserDataQuery = (user) => {
  const fetchUserData = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-user-data", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["userData", user?.username],
    queryFn: fetchUserData,
    enabled: !!user?.username,
  });
};
