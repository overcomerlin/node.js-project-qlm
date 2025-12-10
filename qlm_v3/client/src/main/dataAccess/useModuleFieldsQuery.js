import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useModuleFieldsQuery = (user) => {
  const fetchModuleFields = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-module-fields", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["moduleFields", user?.username],
    queryFn: fetchModuleFields,
    enabled: !!user?.username,
  });
};
