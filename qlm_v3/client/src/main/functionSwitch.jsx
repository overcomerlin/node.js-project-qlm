import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import {
  funcSwitchPageTitle,
  functionFields,
  initUserDataFields,
  saveFuncSwitch,
  storedFail,
  storedSuccess,
  userManagmentPageTitle,
} from "../config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import SwitchGeneral from "./inputFields/switchGeneral";
import { useAllUserFunctionalityQuery } from "./dataAccess/useAllUserFunctionalityQuery";
import { fetchUserFuncAutoCompleteData } from "./utils/fetchUserFuncAutoCompleteData";
import AutocompleteField from "./inputFields/AutocompleteField";
import { useSaveFuncSwitchMutation } from "./dataAccess/useSaveFuncSwitchMutation";
import { toast } from "react-toastify";
import ReturnLoadingError from "./utils/returnLoadingError";

function UserNameFieldBuilder({ user, userRole }) {
  const {
    data: allUserFuncFields,
    isLoading: isAllUserFuncFieldsLoading,
    isError: isAllUserFuncFieldsError,
    error: allUserFuncFieldsError,
  } = useAllUserFunctionalityQuery(user);

  // Build the data list []
  const autoCompleteDataList = useMemo(() => {
    if (
      isAllUserFuncFieldsLoading ||
      !allUserFuncFields ||
      isAllUserFuncFieldsError
    )
      return null;
    return fetchUserFuncAutoCompleteData({ allUserFuncFields });
  }, [allUserFuncFields, isAllUserFuncFieldsLoading]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      BUS_NAME: "",
    },
  });

  // Show up/off the fields of switch by index value
  const [index, setIndex] = useState(null);
  const handleSetIndex = useCallback(
    (index) => {
      setIndex(index);
    },
    [getValues("US_NAME")]
  );
  const busNameValue = watch("BUS_NAME");
  useEffect(() => {
    if (busNameValue.length === 0) setIndex(null);
  }, [busNameValue]);

  const returnLoadingError = (
    <ReturnLoadingError
      isLoading={isAllUserFuncFieldsLoading}
      isError={isAllUserFuncFieldsError}
      error={allUserFuncFieldsError}
    />
  );

  // Check status of isAllUserFuncFieldsLoading and isAllUserFuncFieldsError
  if (isAllUserFuncFieldsLoading || isAllUserFuncFieldsError) {
    return returnLoadingError;
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        {userManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {funcSwitchPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      <MDBRow center className="g-2 mt-2">
        <MDBCol size="4">
          <Controller
            key={"BUS_NAME"}
            name={"BUS_NAME"}
            control={control}
            render={({ field, fieldState }) => (
              <AutocompleteField
                {...field}
                id={"BUS_NAME"}
                label={initUserDataFields.USERNAME.label}
                error={fieldState.error}
                searchField={"BUS_NAME"}
                autoCompleteDataList={
                  !!autoCompleteDataList ? autoCompleteDataList.username : []
                }
                handleAutoCompleteAllFields={handleSetIndex}
                disabled={false}
                uppercase={false}
                contentLength={4}
              />
            )}
          />
        </MDBCol>
      </MDBRow>
      {index === null ? undefined : (
        <FunctionSwitchContent
          user={user}
          funcFields={autoCompleteDataList.functionality[index]}
          username={autoCompleteDataList.username[index]}
          userRole={userRole}
        />
      )}
    </MDBContainer>
  );
}

function FunctionSwitchContent({ user, funcFields, username, userRole }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ISSUE: true,
      RENEW: true,
      REPLACE: true,
      STATISTIC: false,
      PRINT_TUNE: true,
      USER_MANAGMENT_OPEN: true,
      NEW_USER: true,
      FUNC_TUNE: true,
      USER_DATA: true,
      NEW_COMPANY: true,
      ADMIN_MANAGMENT_OPEN: true,
      VEH_SEARCH: true,
      BATCH_PRINT: true,
      DATA_IMPORT: true,
      PRINT_CRTF_SN: true,
      PUBLISH_STATISTIC: true,
      BUS_ID: true,
      BUS_SN: true,
      CRTF_SN: true,
      BUS_NAME: true,
      BUS_VSCC: true,
      NEXT_DATE: true,
      UNIT_NAME: true,
      BUILD_DATE: true,
      CLERK_NAME: true,
      CONTACT_ADDR: true,
      CONTACT_NAME: true,
      PUBLISH_DATE: true,
      PUBLISH_MODE: true,
      CONTACT_PHONE: true,
      VEH_BODY_CODE: true,
      TECHNICIAN_NAME: true,
      VEH_ENGINE_CODE: true,
      VEH_CHASSIS_CODE: true,
    },
  });
  //*** Set the default value for each field from funcFields ***
  useEffect(() => {
    if (funcFields) {
      Object.keys(funcFields).forEach((key) => {
        if (
          key === "USER_MANAGMENT" ||
          key === "ADMIN_MANAGMENT" ||
          key === "FIELDS"
        ) {
          Object.keys(funcFields[key]).forEach((subKey) =>
            setValue(subKey, funcFields[key][subKey], {
              shouldValidate: true,
              shouldDirty: true,
            })
          );
        } else {
          setValue(key, funcFields[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [funcFields, setValue]);

  //*** Build a connection between "USER_MANAGMENT_OPEN -> NEW_USER, NEW_USER, FUNC_TUNE, USER_DATA, NEW_COMPANY" and "ADMIN_MANAGMENT_OPEN -> VEH_SEARCH, BATCH_PRINT, DATA_IMPORT, PRINT_CRTF_SN, PUBLISH_STATISTIC" */
  const userManagmentValue = watch("USER_MANAGMENT_OPEN");
  const adminManagmentValue = watch("ADMIN_MANAGMENT_OPEN");
  useEffect(() => {
    if (!userManagmentValue) {
      setValue("NEW_USER", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("FUNC_TUNE", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("USER_DATA", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("NEW_COMPANY", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      functionFields.USER_MANAGMENT.NEW_USER.disable = true;
      functionFields.USER_MANAGMENT.FUNC_TUNE.disable = true;
      functionFields.USER_MANAGMENT.USER_DATA.disable = true;
      functionFields.USER_MANAGMENT.NEW_COMPANY.disable = true;
    } else {
      setValue("NEW_USER", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("FUNC_TUNE", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("USER_DATA", true, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("NEW_COMPANY", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      functionFields.USER_MANAGMENT.NEW_USER.disable = false;
      functionFields.USER_MANAGMENT.FUNC_TUNE.disable = false;
      functionFields.USER_MANAGMENT.USER_DATA.disable = false;
      functionFields.USER_MANAGMENT.NEW_COMPANY.disable = false;
    }
    if (!adminManagmentValue) {
      setValue("VEH_SEARCH", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("BATCH_PRINT", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("DATA_IMPORT", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PRINT_CRTF_SN", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PUBLISH_STATISTIC", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      functionFields.ADMIN_MANAGMENT.VEH_SEARCH.disable = true;
      functionFields.ADMIN_MANAGMENT.BATCH_PRINT.disable = true;
      functionFields.ADMIN_MANAGMENT.DATA_IMPORT.disable = true;
      functionFields.ADMIN_MANAGMENT.PRINT_CRTF_SN.disable = true;
      functionFields.ADMIN_MANAGMENT.PUBLISH_STATISTIC.disable = true;
    } else {
      setValue("VEH_SEARCH", true, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("BATCH_PRINT", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("DATA_IMPORT", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PRINT_CRTF_SN", false, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PUBLISH_STATISTIC", true, {
        shouldValidate: true,
        shouldDirty: true,
      });
      functionFields.ADMIN_MANAGMENT.VEH_SEARCH.disable = false;
      functionFields.ADMIN_MANAGMENT.BATCH_PRINT.disable = false;
      functionFields.ADMIN_MANAGMENT.DATA_IMPORT.disable = false;
      functionFields.ADMIN_MANAGMENT.PRINT_CRTF_SN.disable = false;
      functionFields.ADMIN_MANAGMENT.PUBLISH_STATISTIC.disable = false;
    }
  }, [userManagmentValue, adminManagmentValue, setValue]);

  //*** submit all function switch to server ***
  const saveFuncSwitchMutation = useSaveFuncSwitchMutation();
  const handleFunctionSwitchSave = (data) => {
    const sentFuncSwitchData = { username: username, ...data };
    saveFuncSwitchMutation.mutate(
      { sentFuncSwitchData },
      {
        onSuccess: (data) => {
          toast.success(data.message || storedSuccess);
        },
        onError: (error) => {
          toast.error(error || storedFail);
        },
      }
    );
  };

  //*** render form functionFields ***
  const allRenderableFields = (prefixKey, key) => {
    let { id, label, disable } = {
      id: null,
      label: null,
      disable: null,
    };
    if (prefixKey === "USER_MANAGMENT" || prefixKey === "ADMIN_MANAGMENT") {
      if (key === "USER_MANAGMENT_OPEN" || key === "ADMIN_MANAGMENT_OPEN")
        ({ id, label, disable } = functionFields[key]);
      else {
        ({ id, label, disable } = functionFields[prefixKey][key]);
      }
    } else if (prefixKey === null && functionFields[key]) {
      ({ id, label, disable } = functionFields[key]);
    } else if (prefixKey === null && functionFields.FIELDS[key]) {
      ({ id, label, disable } = functionFields.FIELDS[key]);
    }
    return (
      <Controller
        key={id}
        name={id}
        control={control}
        render={({ field, fieldState }) => (
          <SwitchGeneral
            {...field}
            id={id}
            label={label}
            error={fieldState.error}
            readOnly={false}
            disabled={disable}
          />
        )}
      />
    );
  };

  const renderMainFuncFields = [
    "ISSUE",
    "RENEW",
    "REPLACE",
    "STATISTIC",
    "PRINT_TUNE",
  ];
  const chunkSizeMainFunc = Math.ceil(renderMainFuncFields.length / 3);
  const colMainFunc = Array.from({ length: 3 }, (_, i) =>
    renderMainFuncFields.slice(
      i * chunkSizeMainFunc,
      (i + 1) * chunkSizeMainFunc
    )
  );

  const renderUserManagmentFields = [
    "USER_MANAGMENT_OPEN",
    "NEW_USER",
    "FUNC_TUNE",
    "USER_DATA",
    "NEW_COMPANY",
  ];
  const chunkSizeUserManagment = Math.ceil(
    renderUserManagmentFields.length / 3
  );
  const colUserManagment = Array.from({ length: 3 }, (_, i) =>
    renderUserManagmentFields.slice(
      i * chunkSizeUserManagment,
      (i + 1) * chunkSizeUserManagment
    )
  );

  const renderAdminManagmentFields = [
    "ADMIN_MANAGMENT_OPEN",
    "VEH_SEARCH",
    "BATCH_PRINT",
    "DATA_IMPORT",
    "PRINT_CRTF_SN",
    "PUBLISH_STATISTIC",
  ];
  const chunkSizeAdminManagment = Math.ceil(
    renderAdminManagmentFields.length / 3
  );
  const colAdminManagment = Array.from({ length: 3 }, (_, i) =>
    renderAdminManagmentFields.slice(
      i * chunkSizeAdminManagment,
      (i + 1) * chunkSizeAdminManagment
    )
  );

  const renderFields = Object.keys(functionFields.FIELDS).reduce(
    (acc, curr) => {
      acc.push(curr);
      return acc;
    },
    []
  );
  const chunkSizeFields = Math.ceil(renderFields.length / 3);
  const colFields = Array.from({ length: 3 }, (_, i) =>
    renderFields.slice(i * chunkSizeFields, (i + 1) * chunkSizeFields)
  );
  return (
    <form>
      <h4>
        <MDBRow center className="g-2 mt-2">
          {colMainFunc.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map((value) => allRenderableFields(null, value))}
            </MDBCol>
          ))}
        </MDBRow>
        <hr className="hr" />
        <MDBRow center className="g-2 mt-2">
          {colUserManagment.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map((value) =>
                allRenderableFields("USER_MANAGMENT", value)
              )}
            </MDBCol>
          ))}
        </MDBRow>
        <hr className="hr" />
        <MDBRow center className="g-2 mt-2">
          {colAdminManagment.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map((value) =>
                allRenderableFields("ADMIN_MANAGMENT", value)
              )}
            </MDBCol>
          ))}
        </MDBRow>
        <hr className="hr" />
        <MDBRow center className="g-2 mt-2">
          {colFields.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map((value) => allRenderableFields(null, value))}
            </MDBCol>
          ))}
        </MDBRow>
      </h4>
      <MDBBtn
        type="buttin"
        className="me-4"
        onClick={handleSubmit(handleFunctionSwitchSave)}
        disabled={false}
      >
        {saveFuncSwitch}
      </MDBBtn>
    </form>
  );
}

export default function FunctionSwitch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (
      moduleFields &&
      (!moduleFields.USER_MANAGMENT?.FUNC_TUNE ||
        moduleFields.userRole !== "ADMIN")
    ) {
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

  //在資料加載完成且權限不符時，等待 useEffect 執行跳轉
  if (!moduleFields || !moduleFields.USER_MANAGMENT?.FUNC_TUNE) {
    return null;
  }

  return <UserNameFieldBuilder user={user} userRole={moduleFields.userRole} />;
}
