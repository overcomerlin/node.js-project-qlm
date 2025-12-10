import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import axios from "axios";

export const useCrtfDataQuery = (user) => {
  const fetchCrtfData = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-crtf-data", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["crtfData"],
    queryFn: fetchCrtfData,
    enabled: !!user?.username,
  });
};
