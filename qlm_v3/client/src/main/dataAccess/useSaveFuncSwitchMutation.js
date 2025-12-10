import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const saveFuncSwitch = async ({ sentFuncSwitchData }) => {
  const functionFields = {
    username: sentFuncSwitchData.username,
    functionality: {
      ISSUE: sentFuncSwitchData.ISSUE,
      RENEW: sentFuncSwitchData.RENEW,
      REPLACE: sentFuncSwitchData.REPLACE,
      STATISTIC: sentFuncSwitchData.STATISTIC,
      PRINT_TUNE: sentFuncSwitchData.PRINT_TUNE,
      USER_MANAGMENT_OPEN: sentFuncSwitchData.USER_MANAGMENT_OPEN,
      ADMIN_MANAGMENT_OPEN: sentFuncSwitchData.ADMIN_MANAGMENT_OPEN,
      USER_MANAGMENT: {
        NEW_USER: sentFuncSwitchData.NEW_USER,
        FUNC_TUNE: sentFuncSwitchData.FUNC_TUNE,
        USER_DATA: sentFuncSwitchData.USER_DATA,
        NEW_COMPANY: sentFuncSwitchData.NEW_COMPANY,
      },
      ADMIN_MANAGMENT: {
        VEH_SEARCH: sentFuncSwitchData.VEH_SEARCH,
        BATCH_PRINT: sentFuncSwitchData.BATCH_PRINT,
        DATA_IMPORT: sentFuncSwitchData.DATA_IMPORT,
        PRINT_CRTF_SN: sentFuncSwitchData.PRINT_CRTF_SN,
        PUBLISH_STATISTIC: sentFuncSwitchData.PUBLISH_STATISTIC,
      },
      FIELDS: {
        BUS_SN: sentFuncSwitchData.BUS_SN,
        BUS_ID: sentFuncSwitchData.BUS_ID,
        BUS_NAME: sentFuncSwitchData.BUS_NAME,
        VEH_CHASSIS_CODE: sentFuncSwitchData.VEH_CHASSIS_CODE,
        VEH_ENGINE_CODE: sentFuncSwitchData.VEH_ENGINE_CODE,
        VEH_BODY_CODE: sentFuncSwitchData.VEH_BODY_CODE,
        BUS_VSCC: sentFuncSwitchData.BUS_VSCC,
        CONTACT_NAME: sentFuncSwitchData.CONTACT_NAME,
        CONTACT_PHONE: sentFuncSwitchData.CONTACT_PHONE,
        CONTACT_ADDR: sentFuncSwitchData.CONTACT_ADDR,
        BUILD_DATE: sentFuncSwitchData.BUILD_DATE,
        PUBLISH_DATE: sentFuncSwitchData.PUBLISH_DATE,
        NEXT_DATE: sentFuncSwitchData.NEXT_DATE,
        CRTF_SN: sentFuncSwitchData.CRTF_SN,
        PUBLISH_MODE: sentFuncSwitchData.PUBLISH_MODE,
        TECHNICIAN_NAME: sentFuncSwitchData.TECHNICIAN_NAME,
        CLERK_NAME: sentFuncSwitchData.CLERK_NAME,
        UNIT_NAME: sentFuncSwitchData.UNIT_NAME,
      },
    },
  };
  const { data: saveFuncSwitchData } = await axios.post(
    "/data/save-func-switch",
    functionFields,
    {
      withCredentials: true,
    }
  );

  return saveFuncSwitchData;
};

export const useSaveFuncSwitchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveFuncSwitch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funcSwitch"] });
    },
  });
};
