import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { emptyField, init_historic_remark, none } from "../../config";
import { format } from "date-fns";

/**
 * Execute API request for save form data
 * @param {object} variables - form data and user info
 * @param {object} variables.data - form data from react-hook-form
 * @param {object} variables.user - present user info
 * @returns {Promise<object>} - data return from server
 */
const saveCrtfData = async ({ data, saveType }) => {
  // Complete all fields to avoid the missing items
  const completedData = { ...emptyField, ...data };

  // Refine and filter fields data
  const { HISTORIC_REMARK, ...restData } = completedData;
  const today = format(new Date(restData.PUBLISH_DATE), "yyyy-MM-dd_hh-mm-ss");
  let remarkTmp = {};
  for (const line of HISTORIC_REMARK.split("\n")) {
    const [date, remark] = line.split(":");
    if (line.includes(init_historic_remark)) {
      continue;
    } else {
      remarkTmp[date] = remark;
    }
  }
  if (restData.REMARK === "") {
    remarkTmp[today] = saveType.type;
  } else {
    remarkTmp[today] = restData.REMARK + " & " + saveType.type;
  }
  restData.REMARK = remarkTmp;

  //eliminate empty string, null and undefine
  Object.keys(restData).forEach((key) => {
    if (restData[key] === "" || !restData[key]) restData[key] = none;
  });

  const { SWITCH_AUTOCOMPLETE, SWITCH_AUTOCOMPLETE_ACCORDANCE, ...storeData } =
    restData;
  const payload = { data: storeData };

  const { data: responseData } = await axios.post("/data/save-crtf", payload, {
    withCredentials: true,
  });

  return responseData;
};

/**
 * Provide useMutation Hook to save crtf data
 */
export const useSaveCrtfMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCrtfData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saveCrtfData"] });
    },
  });
};

export const saveThenPrint = ({ data, user }) => {
  saveSubmit({ data, user });
};
