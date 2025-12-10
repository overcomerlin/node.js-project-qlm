import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useAllUserFunctionalityQuery = (user) => {
  const fetchAllUserFunctionaliy = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-all-user-functionality", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["allUserFunctionality", user?.username],
    queryFn: fetchAllUserFunctionaliy,
    enabled: !!user?.username,
  });
};
