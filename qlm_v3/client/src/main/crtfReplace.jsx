import FieldsProducer from "./fieldsProducer";
import { REPLACE, loadingData } from "../config";
import { useAuth } from "../utils/authContext";
import { useNavigate } from "react-router-dom";
import { usePublishModeFieldsQuery } from "./dataAccess/usePublishModeFieldsQuery";
import { useEffect } from "react";
import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import ReturnLoadingError from "./utils/returnLoadingError";

export default function CrtfReplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: publishModeFields,
    isLoading: isPublishModeFieldsLoading,
    isError: isPublishModeFieldsError,
    error: publishModeFieldsError,
  } = usePublishModeFieldsQuery(user);

  useEffect(() => {
    if (publishModeFields && !publishModeFields.REPLACE) {
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

  // wait for useEffect to execute navigation
  if (!publishModeFields || !publishModeFields.REPLACE) {
    return null;
  }

  return (
    <FieldsProducer publishMode={REPLACE} user={user} navigate={navigate} />
  );
}
