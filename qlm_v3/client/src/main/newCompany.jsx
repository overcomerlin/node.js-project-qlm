import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useEffect, useMemo } from "react";
import ReturnLoadingError from "./utils/returnLoadingError";
import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import {
  newCompany_ADDRESS,
  newCompany_COMPANY_CODE,
  newCompany_COMPANY_NAME,
  newCompany_PHONE,
  newCompany_TAX_ID,
  newCompanyPageTitle,
  requiredField,
  saveBtn,
  storedFail,
  storedSuccess,
  userManagmentPageTitle,
  yupBUS_NAME_Hint,
  yupCOMPANY_CODE_EXISTED_Hint,
  yupOption_Hint,
} from "../config";
import { useAllCompanyQuery } from "./dataAccess/useAllCompanyQuery";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFieldGeneral from "./inputFields/inputFieldGeneral";
import { useNewCompanyMutation } from "./dataAccess/useNewCompanyMutation";
import { toast } from "react-toastify";

function NewCompanyContent({ user, naviagate }) {
  const {
    data: allCompanyCode,
    isLoading: isAllCompanyLoading,
    isError: isAllCompanyError,
    error: allCompanyError,
  } = useAllCompanyQuery(user);

  const validationSchema = useMemo(() => {
    return Yup.object({
      COMPANY_CODE: Yup.string()
        .required(requiredField)
        .matches(/^[a-zA-Z0-9_-]+$/, yupBUS_NAME_Hint)
        .notOneOf(
          allCompanyCode?.companyCode || [],
          yupCOMPANY_CODE_EXISTED_Hint
        ),
      COMPANY_NAME: Yup.string().required(requiredField),
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
  }, [allCompanyCode]);

  const saveNewCompanyMutation = useNewCompanyMutation();
  const hadleNewCompanyDataSave = (data) => {
    const newCompanyData = { ...data };
    saveNewCompanyMutation.mutate(
      { newCompanyData },
      {
        onSuccess: (data) => {
          toast.success(storedSuccess, data.data.COMPANY_NAME);
          naviagate("/");
        },
        onError: (error) => {
          toast.error(error.message || storedFail);
        },
      }
    );
  };

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
      COMPANY_CODE: "",
      COMPANY_NAME: "",
      TAX_ID: "",
      PHONE: "",
      ADDRESS: "",
    },
  });

  if (isAllCompanyLoading || isAllCompanyError) {
    return (
      <ReturnLoadingError
        isLoading={isAllCompanyLoading}
        isError={isAllCompanyError}
        error={allCompanyError}
      />
    );
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        {userManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {newCompanyPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      <form>
        <MDBRow center className="g-2 mt-2">
          <MDBCol size="6">
            <Controller
              name="COMPANY_CODE"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="COMPANY_CODE"
                  label={newCompany_COMPANY_CODE}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
            <Controller
              name="COMPANY_NAME"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="COMPANY_NAME"
                  label={newCompany_COMPANY_NAME}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
            <Controller
              name="TAX_ID"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="TAX_ID"
                  label={newCompany_TAX_ID}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
          </MDBCol>
          <MDBCol size="6">
            <Controller
              name="PHONE"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="PHONE"
                  label={newCompany_PHONE}
                  error={fieldState.error}
                  readOnly={false}
                  disabled={false}
                  uppercase={false}
                />
              )}
            />
            <Controller
              name="ADDRESS"
              control={control}
              render={({ field, fieldState }) => (
                <InputFieldGeneral
                  {...field}
                  id="ADDRESS"
                  label={newCompany_ADDRESS}
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
          onClick={handleSubmit(hadleNewCompanyDataSave)}
          disabled={false}
        >
          {saveBtn}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}

export default function NewCompany() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.USER_MANAGMENT?.NEW_COMPANY) {
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

  if (!moduleFields && !moduleFields.USER_MANAGMENT?.NEW_COMPANY) {
    return null;
  }

  return <NewCompanyContent user={user} naviagate={navigate} />;
}
