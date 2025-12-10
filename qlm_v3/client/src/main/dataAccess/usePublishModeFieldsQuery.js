import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const usePublishModeFieldsQuery = (user) => {
  const fetchPublishModeFields = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-publish-mode-fields", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  return useQuery({
    queryKey: ["publishModeFields", user?.username],
    queryFn: fetchPublishModeFields,
    enabled: !!user?.username,
  });
};
