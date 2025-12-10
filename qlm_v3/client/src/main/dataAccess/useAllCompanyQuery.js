import { useQuery } from "@tanstack/react-query";
import axios, { all } from "axios";
import { useCallback } from "react";

export const useAllCompanyQuery = (user) => {
  const fetchAllCompany = useCallback(async () => {
    if (!user?.username) return null;
    const allCompany = await axios.get("/data/get-all-company", {
      withCredentials: true,
    });
    const result = { companyCode: [] };
    allCompany.data.forEach((company) => {
      result.companyCode.push(company.companyCode);
    });
    return result;
  }, [user?.username]);
  return useQuery({
    queryKey: ["allCompany", user?.username],
    queryFn: fetchAllCompany,
    enabled: !!user?.username,
  });
};
