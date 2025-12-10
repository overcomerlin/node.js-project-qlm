import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useAllUserCompanyQuery = (user) => {
  const fetchAllUserCompany = useCallback(async () => {
    if (!user?.username) return null;
    const allUser = await axios.get("/data/get-all-username", {
      withCredentials: true,
    });
    const allCompany = await axios.get("/data/get-all-company", {
      withCredentials: true,
    });
    const result = {
      id: [],
      companyCode: [],
      companyName: [],
      username: [],
      companyId: [],
    };

    allUser.data.forEach((element) => {
      Object.keys(element).reduce((acc, curr) => {
        acc[curr].push(element[curr]);
        return acc;
      }, result);
    });
    allCompany.data.forEach((element) => {
      Object.keys(element).reduce((acc, curr) => {
        acc[curr].push(element[curr]);
        return acc;
      }, result);
    });

    return result;
  }, [user?.username]);

  return useQuery({
    queryKey: ["allUserCompany", user?.username],
    queryFn: fetchAllUserCompany,
    enabled: !!user?.username,
  });
};
