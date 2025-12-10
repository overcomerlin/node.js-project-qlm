import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

const saveUserData = async ({ userData }) => {
  const today = format(new Date(), "yyyy-MM-dd_hh-mm-ss");
  const { HISTORIC_REMARK, ...userInputData } = userData;
  let remarkTmp = {};
  for (const line of HISTORIC_REMARK.split("\n")) {
    const [date, remark] = line.split(":");
    remarkTmp[date] = remark;
  }
  if (userInputData.REMARK !== "") {
    remarkTmp[today] = userInputData.REMARK;
  }
  userInputData.REMARK = remarkTmp;
  userInputData.UPDATEDAT = new Date();

  const { data: updatedUserData } = await axios.post(
    "/data/save-user-data",
    userInputData,
    {
      withCredentials: true,
    }
  );

  return updatedUserData;
};

export const useSaveUserDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
