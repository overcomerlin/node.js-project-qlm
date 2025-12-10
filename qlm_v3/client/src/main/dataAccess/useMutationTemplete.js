import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * Execute API request for save form data
 * @param {object} variables - form data and user info
 * @param {object} variables.data - form data from react-hook-form
 * @param {object} variables.user - present user info
 * @returns {Promise<object>} - data return from server
 */
const saveCrtfData = async ({ data, user }) => {
  // 根據您的後端 API 需求組合 payload
  const payload = {
    ...data,
    updatedBy: user?.username, // 假設後端需要知道是誰更新的
  };

  // 假設您的儲存 API 端點是 /save-crtf，請根據實際情況修改
  const { data: responseData } = await axios.post("/data/save-crtf", payload, {
    withCredentials: true,
  });

  return responseData;
};

/**
 * 提供儲存合格證資料功能的 useMutation Hook
 */
export const useSaveCrtfMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCrtfData,
    /**
     * mutationFn 成功時觸發。
     * @param {object} data - mutationFn 回傳的資料。
     * @param {object} variables - 呼叫 mutate 時傳入的變數。
     * @param {object} context - onMutate 回傳的 context。
     */
    onSuccess: (data, variables) => {
      console.log("儲存成功:", data);
      // 範例：讓所有 queryKey 為 ['crtf-list'] 的查詢失效，
      // React Query 會在背景自動重新抓取最新資料。
      queryClient.invalidateQueries({ queryKey: ["crtf-list"] });
    },

    /**
     * mutationFn 失敗時觸發。
     * @param {Error} error - 錯誤物件。
     * @param {object} variables - 呼叫 mutate 時傳入的變數。
     * @param {object} context - onMutate 回傳的 context。
     */
    onError: (error, variables) => {
      console.error(
        "儲存失敗:",
        error.response?.data?.message || error.message
      );
      // 可以在此處顯示錯誤通知給使用者
    },

    /**
     * mutationFn 不論成功或失敗，完成後都會觸發。
     */
    onSettled: () => {
      console.log("Mutation 完成 (不論成功或失敗)。");
      // 可以在此處關閉 loading 指示器
    },
  });
};
