import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const saveUserPassword = async ({ userPasswordData }) => {
  const userInputPasswordData = {
    UPDATEDAT: new Date(),
    ...userPasswordData,
  };

  const { data: updatedUserPasswordData } = await axios.post(
    "/data/save-user-password",
    userInputPasswordData,
    {
      withCredentials: true,
    }
  );

  return updatedUserPasswordData;
};

export const useSaveUserPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPassword"] });
    },
  });
};
