import FieldsProducer from "./fieldsProducer";
import { RENEW, loadingData } from "../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { usePublishModeFieldsQuery } from "./dataAccess/usePublishModeFieldsQuery";
import { useEffect } from "react";
import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import ReturnLoadingError from "./utils/returnLoadingError";

export default function CrtfRenew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: publishModeFields,
    isLoading: isPublishModeFieldsLoading,
    isError: isPublishModeFieldsError,
    error: publishModeFieldsError,
  } = usePublishModeFieldsQuery(user);

  useEffect(() => {
    if (publishModeFields && !publishModeFields.RENEW) {
      navigate("/");
    }
  }, [publishModeFields, navigate]);

  const retutnLoadingError = (
    <ReturnLoadingError
      isLoading={isPublishModeFieldsLoading}
      isError={isPublishModeFieldsError}
      error={publishModeFieldsError}
    />
  );

  if (isPublishModeFieldsLoading || isPublishModeFieldsError) {
    return retutnLoadingError;
  }

  // wait for useEffect to execute navigation
  if (!publishModeFields || !publishModeFields.RENEW) {
    return null;
  }

  return <FieldsProducer publishMode={RENEW} user={user} navigate={navigate} />;
}
