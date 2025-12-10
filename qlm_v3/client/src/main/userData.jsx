import {
  initUserDataFields,
  yupCONFIRM_PASSWORD_Hint,
  yupOption_Hint,
  yupPASSWORD_Hint,
  saveBtn,
  pwsSaveBtn,
  userManagmentPageTitle,
  userDataPageTitle,
  adminRole,
  userRole,
  storedFail,
  storedSuccess,
} from "../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import { format } from "date-fns";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { Controller, useForm } from "react-hook-form";
import { useUserDataQuery } from "./dataAccess/useUserDataQuery";
import InputTextFieldGeneral from "./inputFields/inputTextFieldGeneral";
import InputFieldGeneral from "./inputFields/inputFieldGeneral";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSaveUserDataMutation } from "./dataAccess/useSaveUserDataMutation";
import { toast } from "react-toastify";
import { useSaveUserPasswordMutation } from "./dataAccess/useSaveUserPasswordMutation";
import ReturnLoadingError from "./utils/returnLoadingError";

const validationSchema = Yup.object({
  PASSWORD: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .matches(/^(?=.*[@#$_-])[a-zA-Z0-9@#$_-]{5,8}$/, yupPASSWORD_Hint),
  CONFIRM_PASSWORD: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .oneOf([Yup.ref("PASSWORD")], yupCONFIRM_PASSWORD_Hint),
  TAX_ID: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .matches(/^[0-9]{8}$/, yupOption_Hint),
  PHONE: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .matches(/^[0-9]+$/, yupOption_Hint),
  ADDRESS: Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable(),
});

function UserDataContent({ user, navigate }) {
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    error: userDataError,
  } = useUserDataQuery(user);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema, { abortEarly: false }),
    mode: "onChange",
    defaultValues: {
      USERNAME: "",
      PASSWORD: "",
      CONFIRM_PASSWORD: "",
      USER_ROLE: "",
      CREATEDAT: "",
      UPDATEDAT: "",
      COMPANY_NAME: "",
      COMPANY_CODE: "",
      TAX_ID: "",
      PHONE: "",
      ADDRESS: "",
      REMARK: "",
      HISTORIC_REMARK: "",
    },
  });

  //*** Initialize all fields with userData which is fetched from server ***
  useEffect(() => {
    if (userData) {
      setValue("USERNAME", user?.username, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "USER_ROLE",
        userData.userRole === adminRole ? adminRole : userRole,
        { shouldValidate: true, shouldDirty: true }
      );
      setValue(
        "CREATEDAT",
        format(new Date(userData.createdAt), "yyyy-MM-dd"),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setValue(
        "UPDATEDAT",
        format(new Date(userData.updatedAt), "yyyy-MM-dd"),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setValue("COMPANY_NAME", userData.company.companyName, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("COMPANY_CODE", userData.company.companyCode, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("TAX_ID", userData.company.taxId, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PHONE", userData.company.phone, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("ADDRESS", userData.company.address, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "HISTORIC_REMARK",
        Object.keys(userData.userInfo.remark)
          .reduce((acc, curr) => {
            acc += curr + ":" + userData.userInfo.remark[curr] + "\n";
            return acc;
          }, "")
          .slice(0, -1),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  }, [userData, setValue, user.username]);

  //*** submit new user data and password to server ***
  const saveUserDataMutation = useSaveUserDataMutation();
  const saveUserPasswordMutation = useSaveUserPasswordMutation();
  const handleUserDataSave = (data) => {
    const { password, confirmPassword, ...userData } = data;
    saveUserDataMutation.mutate(
      { userData },
      {
        onSuccess: (data) => {
          toast.success(storedSuccess);
          navigate("/");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || storedFail);
        },
      }
    );
  };

  const handleNewPasswordSave = (data) => {
    const { PASSWORD, ...dumpedDate } = data;
    const userPasswordData = { PASSWORD };
    saveUserPasswordMutation.mutate(
      { userPasswordData },
      {
        onSuccess: (data) => {
          toast.success(storedSuccess);
          navigate("/");
        },
        onError: (error) => {
          toast.error(error.message || storedFail);
        },
      }
    );
  };

  //*** render form fields ***/
  const renderField = (key) => {
    const { id, label, disable, uppercase } = initUserDataFields[key];
    if (id === "REMARK" || id === "HISTORIC_REMARK") {
      return (
        <Controller
          key={id}
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <InputTextFieldGeneral
              {...field}
              id={id}
              label={label}
              error={fieldState.error}
              readOnly={false}
              disabled={disable}
              uppercase={!!uppercase}
            />
          )}
        />
      );
    } else {
      return (
        <Controller
          key={id}
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <InputFieldGeneral
              {...field}
              id={id}
              label={label}
              error={fieldState.error}
              readOnly={false}
              disabled={disable}
              uppercase={!!uppercase}
            />
          )}
        />
      );
    }
  };
  // Gather all required fields to renderableKeys
  const renderableKeys = Object.keys(initUserDataFields).filter(
    (key) => key !== "PASSWORD" && key !== "CONFIRM_PASSWORD"
  );
  // Make renderableKeys into 3 columns
  const chunkSize = Math.ceil(renderableKeys.length / 3);
  const columns = Array.from({ length: 3 }, (_, i) =>
    renderableKeys.slice(i * chunkSize, (i + 1) * chunkSize)
  );
  // Gather password and confirm password fields to renderableKeys
  const renderableKeysPws = Object.keys(initUserDataFields).filter(
    (key) => key === "PASSWORD" || key === "CONFIRM_PASSWORD"
  );
  // Make renderableKeysPws into 2 columns
  const chunkSizePws = Math.ceil(renderableKeysPws.length / 2);
  const columnsPws = Array.from({ length: 2 }, (_, i) =>
    renderableKeysPws.slice(i * chunkSizePws, (i + 1) * chunkSizePws)
  );

  const returnLoadingError = (
    <ReturnLoadingError
      isLoading={isUserDataLoading}
      isError={isUserDataError}
      error={userDataError}
    />
  );

  if (isUserDataLoading || isUserDataError) {
    return returnLoadingError;
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        {userManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {userDataPageTitle}
        </MDBBadge>
        <hr className="hr" />
      </h3>
      <form>
        <MDBRow center className="g-2 mt-2">
          {columns.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map(renderField)}
            </MDBCol>
          ))}
        </MDBRow>
        <MDBBtn
          type="button"
          className="me-4"
          onClick={handleSubmit(handleUserDataSave)}
          disabled={false}
        >
          {saveBtn}
        </MDBBtn>
        <hr className="hr" />
        <MDBRow center className="g-2 mt-2">
          {columnsPws.map((columnKeys, colIndex) => (
            <MDBCol size="6" key={`col-${colIndex}`}>
              {columnKeys.map(renderField)}
            </MDBCol>
          ))}
        </MDBRow>
        <MDBBtn
          type="button"
          className="me-4"
          onClick={handleSubmit(handleNewPasswordSave)}
          disabled={false}
        >
          {pwsSaveBtn}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}

export default function UserData() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.USER_MANAGMENT?.USER_DATA) {
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
  if (!moduleFields || !moduleFields.USER_MANAGMENT?.USER_DATA) {
    return null;
  }

  return <UserDataContent user={user} navigate={navigate} />;
}
