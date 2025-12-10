import FieldsProducer from "./fieldsProducer";
import { ISSUE, loadingData } from "../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { useEffect } from "react";
import { usePublishModeFieldsQuery } from "./dataAccess/usePublishModeFieldsQuery";
import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import ReturnLoadingError from "./utils/returnLoadingError";

export default function CrtfIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: publishModeFields,
    isLoading: isPublishModeFieldsLoading,
    isError: isPublishModeFieldsError,
    error: publishModeFieldsError,
  } = usePublishModeFieldsQuery(user);

  useEffect(() => {
    if (publishModeFields && !publishModeFields.ISSUE) {
      navigate("/");
    }
  }, [publishModeFields, navigate]);

  const returnLoadingError = (
    <ReturnLoadingError
      isLoading={isPublishModeFieldsLoading}
      isError={isPublishModeFieldsError}
      error={publishModeFieldsError}
    />
  );

  if (isPublishModeFieldsLoading || isPublishModeFieldsError) {
    return returnLoadingError;
  }

  // 在資料加載完成且權限不符時，等待 useEffect 執行跳轉
  if (!publishModeFields || !publishModeFields.ISSUE) {
    return null;
  }

  return <FieldsProducer publishMode={ISSUE} user={user} navigate={navigate} />;
}
