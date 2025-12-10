import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const savePrintTuneData = async ({ data }) => {
  const sendPrintTuneData = {
    BUS_ID: [
      parseInt(data.BUS_ID_X),
      parseInt(data.BUS_ID_Y),
      parseInt(data.BUS_ID_sz),
    ],
    BUS_NAME: [
      parseInt(data.BUS_NAME_X),
      parseInt(data.BUS_NAME_Y),
      parseInt(data.BUS_NAME_sz),
    ],
    VEH_CODE: [
      parseInt(data.VEH_CODE_X),
      parseInt(data.VEH_CODE_Y),
      parseInt(data.VEH_CODE_sz),
    ],
    BUS_VSCC: [
      parseInt(data.BUS_VSCC_X),
      parseInt(data.BUS_VSCC_Y),
      parseInt(data.BUS_VSCC_sz),
    ],
    MODEL_SN: [
      parseInt(data.MODEL_SN_X),
      parseInt(data.MODEL_SN_Y),
      parseInt(data.MODEL_SN_sz),
    ],
    NEXT_DATE: [
      parseInt(data.NEXT_DATE_X),
      parseInt(data.NEXT_DATE_Y),
      parseInt(data.NEXT_DATE_sz),
    ],
    PUBLISH_DATE: [
      parseInt(data.PUBLISH_DATE_X),
      parseInt(data.PUBLISH_DATE_Y),
      parseInt(data.PUBLISH_DATE_sz),
    ],
  };
  const { data: responseData } = await axios.post(
    "/data/save-print-tune",
    { sendPrintTuneData },
    { withCredentials: true }
  );
  return responseData;
};

export const useSavePrintTuneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePrintTuneData,
    onSuccess: () => {
      // Invalidate all queries with queryKey: ["print-tune"]
      queryClient.invalidateQueries({ queryKey: ["print-tune"] });
    },
  });
};
