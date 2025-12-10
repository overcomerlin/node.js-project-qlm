import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const saveNewCompanyData = async ({ newCompanyData }) => {
  const { data: responseData } = await axios.post(
    "/data/save-new-company",
    { newCompanyData },
    { withCredentials: true }
  );
  return responseData;
};
export const useNewCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNewCompanyData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCompany"] });
    },
  });
};
