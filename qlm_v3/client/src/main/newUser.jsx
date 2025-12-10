import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import {
  newUser_COMPANYCODE,
  newUser_CONFIRM_PASSWORD,
  newUser_PASSWORD,
  newUser_USERNAME,
  newUserPageTitle,
  requiredField,
  saveBtn,
  storedFail,
  storedSuccess,
  userManagmentPageTitle,
  yupBUS_NAME_Hint,
  yupCOMPANY_CODE_Hint,
  yupCONFIRM_PASSWORD_Hint,
  yupPASSWORD_Hint,
  yupUSERNAME_EXISTED_Hint,
} from "../config";
import { useAuth } from "../utils/authContext";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useAllUserCompanyQuery } from "./dataAccess/useAllUserCompanyQuery";
import ReturnLoadingError from "./utils/returnLoadingError";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFieldGeneral from "./inputFields/inputFieldGeneral";
import AutocompleteVSCC from "./inputFields/AutocompleteVSCC";
import { useNewUserMutation } from "./dataAccess/useNewUserMutation";
import { toast } from "react-toastify";

function NewUserContent({ user, navigate }) {
  const {
    data: allUserCompany,
    isLoading: isAllUserCompanyLoading,
    isError: isAllUserCompanyError,
    error: allUserCompanyError,
  } = useAllUserCompanyQuery(user);

  const validationSchema = useMemo(() => {
    return Yup.object({
      USERNAME: Yup.string()
        .required(requiredField)
        .matches(/^[a-zA-Z0-9_-]+$/, yupBUS_NAME_Hint)
        .notOneOf(allUserCompany?.username || [], yupUSERNAME_EXISTED_Hint),
      PASSWORD: Yup.string()
        .required(requiredField)
        .matches(/^(?=.*[@#$_-])[a-zA-Z0-9@#$_-]{5,8}$/, yupPASSWORD_Hint),
      CONFIRM_PASSWORD: Yup.string()
        .required(requiredField)
        .oneOf([Yup.ref("PASSWORD")], yupCONFIRM_PASSWORD_Hint),
      COMPANY_CODE: Yup.string()
        .required(requiredField)
        .oneOf(allUserCompany?.companyCode || [], yupCOMPANY_CODE_Hint),
    });
  }, [allUserCompany]);

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
      COMPANY_CODE: "",
    },
  });
  // Feed allUserCompany.companyCode list to AutocompleteVSCC according to watch("USERNAME")
  const usernameValue = watch("USERNAME");
  const [companyCodeSuggestions, setCompanyCodeSuggestions] = useState([]);
  useEffect(() => {
    if (usernameValue.length !== 0)
      setCompanyCodeSuggestions(allUserCompany?.companyCode || []);
  }, [usernameValue]);

  const saveNewUserMutation = useNewUserMutation();
  const handleNewUserDataSave = (data) => {
    const newUserData = { COMPANY_ID: -1, ...data };
    for (let i = 0; i < allUserCompany.companyCode.length; i++) {
      if (
        data.COMPANY_CODE.toLowerCase().trim() === allUserCompany.companyCode[i]
      ) {
        newUserData.COMPANY_ID = allUserCompany.id[i];
        break;
      }
    }
    saveNewUserMutation.mutate(
      { newUserData },
      {
        onSuccess: (data) => {
          toast.success(storedSuccess, data.data.username);
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
        {userManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {newUserPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      <form>
        <MDBRow center className="g-2 mt-2">
          <MDBCol size="6">
            <Controller
              name="USERNAME"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="USERNAME"
                  label={newUser_USERNAME}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
            <Controller
              name="COMPANY_CODE"
              control={control}
              render={({ field, fieldState }) => (
                <AutocompleteVSCC
                  {...field}
                  id="COMPANY_CODE"
                  label={newUser_COMPANYCODE}
                  error={fieldState.error}
                  searchField="COMPANY_CODE"
                  disabled={false}
                  externalSuggestions={companyCodeSuggestions}
                />
              )}
            />
          </MDBCol>
          <MDBCol size="6">
            <Controller
              name="PASSWORD"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="PASSWORD"
                  label={newUser_PASSWORD}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
            <Controller
              name="CONFIRM_PASSWORD"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="CONFIRM_PASSWORD"
                  label={newUser_CONFIRM_PASSWORD}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
          </MDBCol>
        </MDBRow>
        <MDBBtn
          type="button"
          className="me-4"
          onClick={handleSubmit(handleNewUserDataSave)}
          disabled={false}
        >
          {saveBtn}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}

export default function NewUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.USER_MANAGMENT?.NEW_USER) {
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
  if (!moduleFields || !moduleFields.USER_MANAGMENT?.NEW_USER) {
    return null;
  }

  return <NewUserContent user={user} navigate={navigate} />;
}
