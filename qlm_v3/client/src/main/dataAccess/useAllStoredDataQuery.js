import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useAllStoredDataQuery = (user) => {
  const fetchAllStoredData = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-all-stored-data", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["allStoredData", user?.username],
    queryFn: fetchAllStoredData,
    enabled: !!user?.username,
  });
};
