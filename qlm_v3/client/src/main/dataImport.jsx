import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useEffect } from "react";
import { MDBBadge, MDBContainer } from "mdb-react-ui-kit";
import ReturnLoadingError from "./utils/returnLoadingError";
import {
  adminManagmentPageTitle,
  dataImportCompany,
  dataImportCrtf,
  dataImportPageTitle,
  dataImportUser,
  storedFail,
} from "../config";
import ExcelDataReader from "./inputFields/ExcelDataReader";
import { useAllUserCompanyQuery } from "./dataAccess/useAllUserCompanyQuery";
import { useDataImportMutation } from "./dataAccess/useDataImportMutation";
import "../css/general.css";
import { toast } from "react-toastify";

const DataImportUser = ({ allUserCompany, handleDataImportSave }) => {
  return (
    <>
      <h4>
        <MDBBadge className="mx-2" color="info" light>
          {dataImportUser}
        </MDBBadge>
      </h4>
      <ExcelDataReader
        importType="user"
        allUserCompany={allUserCompany}
        handleDataImportSave={handleDataImportSave}
      />
    </>
  );
};

const DataImportCompany = ({ allUserCompany, handleDataImportSave }) => {
  return (
    <>
      <h4>
        <MDBBadge className="mx-2" color="info" light>
          {dataImportCompany}
        </MDBBadge>
      </h4>
      <ExcelDataReader
        importType="company"
        allUserCompany={allUserCompany}
        handleDataImportSave={handleDataImportSave}
      />
    </>
  );
};

const DataImportCrtf = ({ allUserCompany, handleDataImportSave }) => {
  return (
    <>
      <h4>
        <MDBBadge className="mx-2" color="info" light>
          {dataImportCrtf}
        </MDBBadge>
      </h4>
      <ExcelDataReader
        importType="crtf"
        allUserCompany={allUserCompany}
        handleDataImportSave={handleDataImportSave}
      />
    </>
  );
};

const DataImportContent = ({ user, navigate, userRole }) => {
  const {
    data: allUserCompany,
    isLoading: isAllUserCompanyLoading,
    isError: isAllUserCompanyError,
    error: allUserCompanyError,
  } = useAllUserCompanyQuery(user);

  const saveDataImportMutation = useDataImportMutation();
  const handleDataImportSave = (data, columns, importType) => {
    saveDataImportMutation.mutate(
      { data, columns, importType },
      {
        onSuccess: (data) => {
          toast.success(
            importType + " - " + data.data.count + " " + data.message
          );
          navigate("/");
        },
        onError: (error) => {
          toast.error(error.message || storedFail);
        },
      }
    );
  };

  if (isAllUserCompanyLoading || isAllUserCompanyError) {
    return (
      <ReturnLoadingError
        isLoading={isAllUserCompanyLoading}
        isError={isAllUserCompanyError}
        error={allUserCompanyError}
      />
    );
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        {adminManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {dataImportPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      {userRole === "ADMIN" && (
        <>
          <DataImportUser
            allUserCompany={allUserCompany}
            handleDataImportSave={handleDataImportSave}
          />
          <hr className="hr2" />
          <DataImportCompany
            allUserCompany={allUserCompany}
            handleDataImportSave={handleDataImportSave}
          />
          <hr className="hr2" />
        </>
      )}
      <DataImportCrtf
        allUserCompany={allUserCompany}
        handleDataImportSave={handleDataImportSave}
      />
    </MDBContainer>
  );
};

export default function DataImport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.ADMIN_MANAGMENT?.DATA_IMPORT) {
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
  if (!moduleFields || !moduleFields.ADMIN_MANAGMENT?.DATA_IMPORT) {
    return null;
  }

  return (
    <DataImportContent
      user={user}
      navigate={navigate}
      userRole={moduleFields.userRole}
    />
  );
}
