import axios from "axios";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

export const usePrintTuneQuery = (user) => {
  const fetchPrintTune = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-print-tune", {
      withCredentials: true,
    });

    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["print-tune", user?.username],
    queryFn: fetchPrintTune,
    enabled: !!user?.username,
  });
};
