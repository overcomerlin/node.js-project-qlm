import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * A custom hook to fetch the fields configuration for a given user.
 * @param {object} user - The user object from useAuth.
 * @returns {object} The state from useQuery, including `data`, `isLoading`, `isError`, and `error`.
 */
export const useFieldsQuery = (user) => {
  const fetchFields = useCallback(async () => {
    if (!user?.username) return null;
    const response = await axios.get("/data/get-fields", {
      withCredentials: true,
    });
    return response.data;
  }, [user?.username]);

  // useQuery will return an object with all the states we need.
  // We can directly return this object from our custom hook.
  return useQuery({
    queryKey: ["fields", user?.username],
    queryFn: fetchFields,
    enabled: !!user?.username, // Only run the query if the user exists
  });
};
