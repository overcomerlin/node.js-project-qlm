import {
  initFormData,
  vsccCandidate,
  saveBtn,
  saveAndPrintBtn,
  autocomplete_enable,
  autocomplete_disable,
  printPageTitle,
  crtf,
  storedSuccess,
  storedFail,
  requiredField,
  RENEW,
  REPLACE,
  ISSUE,
  autocomplete_by_bus_id,
  autocomplete_by_bus_sn,
  init_historic_remark,
  yupBUS_SN_Hint,
  yupBUS_ID_Hint,
  yupOption_Hint,
  yupVEH_Code_Hint,
  yupRequired_Hint,
  yupBUS_NAME_Hint,
  SAVE,
  PRINT,
} from "../config";
import {
  MDBBadge,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addYears } from "date-fns";
import InputFieldDatePicker from "./inputFields/inputFieldDataPicker";
import InputFieldGeneral from "./inputFields/inputFieldGeneral";
import InputTextFieldGeneral from "./inputFields/inputTextFieldGeneral";
import AutocompleteField from "./inputFields/AutocompleteField";
import AutocompleteVSCC from "./inputFields/AutocompleteVSCC";
import SwitchGeneral from "./inputFields/switchGeneral";
import PrintModal from "./inputFields/printModal";
import { useFieldsQuery } from "./dataAccess/useFieldsQuery";
import { useSaveCrtfMutation } from "./dataAccess/crtfSaveAndPrint";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAllStoredDataQuery } from "./dataAccess/useAllStoredDataQuery";
import { fetchAutoCompleteData } from "./utils/fetchAutoCompleteData";
import ReturnLoadingError from "./utils/returnLoadingError";

const validationSchema = Yup.object({
  BUS_SN: Yup.string()
    .required(requiredField)
    .matches(/^J[0-9]{3}[SU]-[0-9]{4}-[0-9]{4}$/, yupBUS_SN_Hint),
  BUS_ID: Yup.string()
    .required(requiredField)
    .matches(/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/, yupBUS_ID_Hint),
  BUS_NAME: Yup.string()
    .required(requiredField)
    .matches(
      /^(?=.*[\u4e00-\u9fa5])[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
      yupBUS_NAME_Hint
    ),
  VEH_CHASSIS_CODE: Yup.string()
    .matches(/^[a-zA-Z0-9-* ]*$/, yupOption_Hint)
    .when(["VEH_ENGINE_CODE", "VEH_BODY_CODE"], {
      is: (e, b) => !e && !b,
      then: (schema) => schema.required(yupVEH_Code_Hint),
    }),
  VEH_ENGINE_CODE: Yup.string().matches(/^[a-zA-Z0-9-* ]*$/, yupOption_Hint),
  VEH_BODY_CODE: Yup.string().matches(/^[a-zA-Z0-9-* ]*$/, yupOption_Hint),
  BUS_VSCC: Yup.string().matches(/^[A-Z0-9]+-[0-9]+$/, yupRequired_Hint),
  CONTACT_NAME: Yup.string(),
  CONTACT_PHONE: Yup.string(),
  CONTACT_ADDR: Yup.string(),
  BUILD_DATE: Yup.string().required(requiredField),
  PUBLISH_DATE: Yup.string().required(requiredField),
  NEXT_DATE: Yup.string().required(requiredField),
  PUBLISH_MODE: Yup.string().required(requiredField),
  CRTF_SN: Yup.string(),
  TECHNICIAN_NAME: Yup.string(),
  CLERK_NAME: Yup.string(),
  UNIT_NAME: Yup.string(),
  REMARK: Yup.string(),
});

export default function FieldsProducer({ publishMode, user, navigate }) {
  const today = new Date();
  let { data, isLoading, isError, error } = {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  };
  // Fetch all stored crtf data of this user
  if (publishMode === RENEW || publishMode === REPLACE) {
    ({ data, isLoading, isError, error } = useAllStoredDataQuery(user));
  }

  if (isLoading || isError) {
    return (
      <ReturnLoadingError
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    );
  }

  return (
    <FieldsBuilder
      user={user}
      today={today}
      publishMode={publishMode}
      autoCompleteData={data}
      navigate={navigate}
    />
  );
}

function FieldsBuilder({
  user,
  today,
  publishMode,
  autoCompleteData,
  navigate,
}) {
  const {
    data: fields,
    isLoading: loading,
    isError,
    error,
  } = useFieldsQuery(user);

  const autoCompleteDataList = useMemo(() => {
    if (loading || !fields) return null; // 當資料載入中或不存在時，回傳一個空物件
    return fetchAutoCompleteData({ autoCompleteData, fields });
  }, [autoCompleteData, fields, loading]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema, {
      abortEarly: false, // Collect all errors for each field
    }),
    mode: "onChange",
    defaultValues: {
      BUS_SN: "",
      BUS_ID: "",
      BUS_NAME: "",
      VEH_CHASSIS_CODE: "",
      VEH_ENGINE_CODE: "",
      VEH_BODY_CODE: "",
      BUS_VSCC: "",
      CONTACT_NAME: "",
      CONTACT_PHONE: "",
      CONTACT_ADDR: "",
      BUILD_DATE: today,
      PUBLISH_DATE: today,
      NEXT_DATE: addYears(today, 2),
      PUBLISH_MODE: publishMode,
      CRTF_SN: "",
      TECHNICIAN_NAME: "",
      CLERK_NAME: user?.username,
      UNIT_NAME: user?.companyCode,
      REMARK: "",
      HISTORIC_REMARK: init_historic_remark,
      SWITCH_AUTOCOMPLETE: true,
      SWITCH_AUTOCOMPLETE_ACCORDANCE: true,
    },
  });

  // set NEXT_DATE according to PUBLISH_DATE (add 2 years)
  const publishDateValue = watch("PUBLISH_DATE");
  useEffect(() => {
    if (publishDateValue) {
      setValue("NEXT_DATE", addYears(new Date(publishDateValue), 2), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [publishDateValue, setValue]);

  // set BUS_VSCC according to watching "BUS_SN"
  const busSnValue = watch("BUS_SN");
  const [vsccSuggestions, setVSCCSuggestions] = useState([]);
  useEffect(() => {
    // Set BUS_VSCC to empty string if BUS_SN is changed on the ISSUE mode
    if (publishMode === ISSUE && getValues("BUS_VSCC").length !== 0) {
      setValue("BUS_VSCC", "", { shouldValidate: true, shouldDirty: true });
    }
    if (busSnValue.length >= 5) {
      const key = busSnValue.substring(0, 4);
      setVSCCSuggestions(vsccCandidate[key] || []);
    } else {
      setVSCCSuggestions([]);
    }
  }, [busSnValue, setValue]);

  // *** Watching " SWITCH_AUTOCOMPLETE" and "SWITCH_AUTOCOMPLETE_ACCORDANCE" to
  // control the switches, SWITCH_AUTOCOMPLETE and SWITCH_AUTOCOMPLETE_ACCORDANCE.
  // Use watch hook to enable/disable autocomplete fields, BUS_SN and BUS_ID. ***
  const switchValue = watch("SWITCH_AUTOCOMPLETE");
  const switchAccordanceValue = watch("SWITCH_AUTOCOMPLETE_ACCORDANCE");
  const [autoCompleteSwitchLabel, setAutoCompleteSwitchLabel] = useState({
    ac: autocomplete_enable,
    ac_by: autocomplete_by_bus_id,
  });
  useEffect(() => {
    if (switchValue && switchAccordanceValue) {
      setAutoCompleteSwitchLabel({
        ...autoCompleteSwitchLabel,
        ac: autocomplete_enable,
        ac_by: autocomplete_by_bus_id,
      });
    } else if (switchValue && !switchAccordanceValue) {
      setAutoCompleteSwitchLabel({
        ...autoCompleteSwitchLabel,
        ac: autocomplete_enable,
        ac_by: autocomplete_by_bus_sn,
      });
    } else {
      setAutoCompleteSwitchLabel({
        ...autoCompleteSwitchLabel,
        ac: autocomplete_disable,
      });
    }
  }, [switchValue, switchAccordanceValue]);

  // *** Auto complete all fields by watching "BUS_ID" and "BUS_SN"
  // Pass to and launched by <AutocompleteField /> ***
  const handleAutoCompleteAllFields = useCallback(
    (index) => {
      if (!autoCompleteDataList || index === undefined) return;
      if (switchValue && switchAccordanceValue) {
        setValue("BUS_SN", autoCompleteDataList.BUS_SN?.[index], {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else if (switchValue && !switchAccordanceValue) {
        setValue("BUS_ID", autoCompleteDataList.BUS_ID?.[index], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setValue("BUS_NAME", autoCompleteDataList.BUS_NAME?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "VEH_CHASSIS_CODE",
        autoCompleteDataList.VEH_CHASSIS_CODE?.[index],
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setValue(
        "VEH_ENGINE_CODE",
        autoCompleteDataList.VEH_ENGINE_CODE?.[index],
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setValue("VEH_BODY_CODE", autoCompleteDataList.VEH_BODY_CODE?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("BUS_VSCC", autoCompleteDataList.BUS_VSCC?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("CONTACT_NAME", autoCompleteDataList.CONTACT_NAME?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("CONTACT_PHONE", autoCompleteDataList.CONTACT_PHONE?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("CONTACT_ADDR", autoCompleteDataList.CONTACT_ADDR?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("BUILD_DATE", autoCompleteDataList.BUILD_DATE?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("PUBLISH_DATE", autoCompleteDataList.PUBLISH_DATE?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("NEXT_DATE", autoCompleteDataList.NEXT_DATE?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      // setValue("PUBLISH_MODE", autoCompleteDataList.PUBLISH_MODE?.[index], {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // });
      setValue("CRTF_SN", autoCompleteDataList.CRTF_SN?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "TECHNICIAN_NAME",
        autoCompleteDataList.TECHNICIAN_NAME?.[index],
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      setValue("CLERK_NAME", autoCompleteDataList.CLERK_NAME?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("UNIT_NAME", autoCompleteDataList.UNIT_NAME?.[index], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("REMARK", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "HISTORIC_REMARK",
        Object.keys(autoCompleteDataList.HISTORIC_REMARK?.[index])
          .reduce((acc, curr) => {
            acc +=
              curr +
              ":" +
              autoCompleteDataList.HISTORIC_REMARK?.[index][curr] +
              "\n";
            return acc;
          }, "")
          .slice(0, -1),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    },
    [getValues("BUS_ID"), getValues("BUS_SN")]
  );

  //*** submit and print form data to server ***
  const [modalToggle, setModalToggle] = useState(false);
  const [execPrint, setExecPrint] = useState(false);
  const [printData, setPrintData] = useState({});
  const toggleOpen = () => setModalToggle(!modalToggle);
  const saveCrtfMutation = useSaveCrtfMutation();
  const handleSave = (data) => {
    saveCrtfMutation.mutate(
      { data, saveType: { type: SAVE } },
      {
        onSuccess: (data, variables) => {
          const busSN = data.crtfNo.split("_")[0];
          const busID = data.crtfNo.split("_")[1];
          toast.success(
            `${crtf} ${initFormData.BUS_SN.label}(${busSN}) ${initFormData.BUS_ID.label}(${busID}) ${storedSuccess}`
          );
          navigate("/");
        },
        onError: (error, variables) => {
          toast.error(error || storedFail);
        },
      }
    );
  };
  const handleSavePrint = (data) => {
    setExecPrint(true);
    setPrintData({
      ...data,
      username: user?.username,
      saveType: { type: PRINT },
    });
    toggleOpen();
  };

  //***  render form fields ***
  const renderField = (key) => {
    const { id, label, disable, uppercase } = initFormData[key];
    const isDataPicker =
      id === "BUILD_DATE" || id === "PUBLISH_DATE" || id === "NEXT_DATE";
    if (isDataPicker) {
      return (
        <Controller
          key={id}
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <InputFieldDatePicker
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
    } else if (
      switchValue &&
      ((!switchAccordanceValue && id === "BUS_SN") ||
        (switchAccordanceValue && id === "BUS_ID"))
    ) {
      return (
        <Controller
          key={id}
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <AutocompleteField
              {...field}
              id={id}
              label={label}
              error={fieldState.error}
              searchField={id} // name of api to server
              autoCompleteDataList={
                !!autoCompleteDataList ? autoCompleteDataList[id] : []
              }
              handleAutoCompleteAllFields={handleAutoCompleteAllFields}
              disabled={disable}
              uppercase={!!uppercase}
              contentLength={4}
            />
          )}
        />
      );
    } else if (id === "BUS_VSCC") {
      return (
        <Controller
          key={id}
          name={id}
          control={control}
          render={({ field, fieldState }) => (
            <AutocompleteVSCC
              {...field}
              id={id}
              label={label}
              error={fieldState.error}
              searchField={id} // name of api to server
              disabled={disable}
              externalSuggestions={vsccSuggestions}
            />
          )}
        />
      );
    } else if (id === "REMARK" || id === "HISTORIC_REMARK") {
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
  const renderableKeys = Object.keys(initFormData).filter(
    (key) => fields?.[key]
  );
  // Make renderableKeys into 3 columns
  const chunkSize = Math.ceil(renderableKeys.length / 3);
  const columns = Array.from({ length: 3 }, (_, i) =>
    renderableKeys.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  if (loading || isError) {
    return (
      <ReturnLoadingError isLoading={loading} isError={isError} error={error} />
    );
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        <MDBBadge className="mx-2" color="danger" light>
          {publishMode}
        </MDBBadge>
        {printPageTitle}
      </h3>
      <hr className="hr" />
      <form>
        <MDBRow center className="g-2 mt-2">
          {columns.map((columnKeys, colIndex) => (
            <MDBCol size="4" key={`col-${colIndex}`}>
              {columnKeys.map(renderField)}
            </MDBCol>
          ))}
        </MDBRow>
        <MDBRow className="mt-1">
          <MDBCol size="2">
            {publishMode !== ISSUE && (
              <Controller
                key="SWITCH_AUTOCOMPLETE"
                name="SWITCH_AUTOCOMPLETE"
                control={control}
                render={({ field, fieldState }) => (
                  <SwitchGeneral
                    {...field}
                    id="SWITCH_AUTOCOMPLETE"
                    label={autoCompleteSwitchLabel.ac}
                    error={fieldState.error}
                    readOnly={false}
                    disabled={false}
                  />
                )}
              />
            )}
          </MDBCol>
          <MDBCol size="3">
            {publishMode !== ISSUE && switchValue && (
              <Controller
                key="SWITCH_AUTOCOMPLETE_ACCORDANCE"
                name="SWITCH_AUTOCOMPLETE_ACCORDANCE"
                control={control}
                render={({ field, fieldState }) => (
                  <SwitchGeneral
                    {...field}
                    id="SWITCH_AUTOCOMPLETE_ACCORDANCE"
                    label={autoCompleteSwitchLabel.ac_by}
                    error={fieldState.error}
                    readOnly={false}
                    disabled={false}
                  />
                )}
              />
            )}
          </MDBCol>
        </MDBRow>
        <MDBBtn
          type="button"
          className="me-4"
          onClick={handleSubmit(handleSave)}
          disabled={useSaveCrtfMutation.isLoading}
        >
          {saveBtn}
        </MDBBtn>
        <MDBBtn
          type="button"
          className="me-4"
          onClick={handleSubmit(handleSavePrint)}
          disabled={useSaveCrtfMutation.isLoading}
        >
          {saveAndPrintBtn}
        </MDBBtn>
      </form>
      <PrintModal
        modalToggle={modalToggle}
        toggleOpen={setModalToggle}
        printData={printData}
        toast={toast}
        navigate={navigate}
        saveCrtfMutation={saveCrtfMutation}
        initFormData={initFormData}
      />
    </MDBContainer>
  );
}
