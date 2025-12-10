import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import {
  adminManagmentPageTitle,
  pending,
  vehSearchPageTitle,
} from "../config";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useEffect } from "react";
import ReturnLoadingError from "./utils/returnLoadingError";

function VehicleSearchContent({ user, navigate }) {
  return (
    <MDBContainer className="my-5">
      <h3>
        {adminManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {vehSearchPageTitle}
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
}

export default function VehicleSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.ADMIN_MANAGMENT?.VEH_SEARCH) {
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
  if (!moduleFields || !moduleFields.ADMIN_MANAGMENT?.VEH_SEARCH) {
    return null;
  }

  return <VehicleSearchContent user={user} navigate={navigate} />;
}
