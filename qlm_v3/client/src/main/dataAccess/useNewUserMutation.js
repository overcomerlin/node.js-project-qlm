import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const saveNewUserData = async ({ newUserData }) => {
  const { data: responseData } = await axios.post(
    "/data/save-new-user",
    { newUserData },
    { withCredentials: true }
  );
  return responseData;
};

export const useNewUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNewUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUserCompany"] });
    },
  });
};
