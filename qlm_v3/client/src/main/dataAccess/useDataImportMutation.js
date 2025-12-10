import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const saveDataImport = async ({ data, columns, importType }) => {
  console.log("data in mutation:", data);
  console.log("columns in mutation:", columns);
  console.log("importType in mutation:", importType);

  let dataAPI = "/data/save-import-user";
  if (importType === "company") dataAPI = "/data/save-import-company";
  else if (importType === "crtf") dataAPI = "/data/save-import-crtf";

  const { data: response } = await axios.post(
    dataAPI,
    { data },
    {
      withCredentials: true,
    }
  );
  return response;
};
export const useDataImportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDataImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataImport"] });
    },
  });
};
