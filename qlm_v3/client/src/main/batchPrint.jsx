import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useEffect } from "react";
import { MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import ReturnLoadingError from "./utils/returnLoadingError";
import {
  adminManagmentPageTitle,
  batchPrintPageTitle,
  pending,
} from "../config";

const BatchPrintContent = () => {
  return (
    <MDBContainer className="my-5">
      <h3>
        {adminManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {batchPrintPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      <h1>
        <MDBBadge pill color="dark" light>
          {pending}
        </MDBBadge>
      </h1>
    </MDBContainer>
  );
};

export default function BatchPrint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.ADMIN_MANAGMENT?.BATCH_PRINT) {
      navigate("/");
    }
  }, [moduleFields, navigate]);

  if (isModuleFieldsLoading || isModuleFieldsError) {
    return (
      <ReturnLoadingError
        isLoading={isModuleFieldsLoading}
        isError={isModuleFieldsError}
        error={moduleFieldsError}
      />
    );
  }

  //Waiting for navigate("/") in useEffect when loading data finished and the unauthenticated.
  if (!moduleFields || !moduleFields.ADMIN_MANAGMENT?.BATCH_PRINT) {
    return null;
  }

  return <BatchPrintContent />;
}
