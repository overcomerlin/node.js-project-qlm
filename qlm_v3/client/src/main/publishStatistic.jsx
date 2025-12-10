import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { useModuleFieldsQuery } from "./dataAccess/useModuleFieldsQuery";
import { useEffect, useMemo, useState } from "react";
import ReturnLoadingError from "./utils/returnLoadingError";
import {
  MDBBadge,
  MDBContainer,
  MDBCheckbox,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import {
  adminManagmentPageTitle,
  publishDataFields,
  publishStatisticColCheckbox,
  publishStatisticPageTitle,
  publishStatisticSampleColumns,
  publishStatisticSampleData,
} from "../config";
import DataTable from "./inputFields/DataTable";
import { useCrtfDataQuery } from "./dataAccess/useCrtfDataQuery";
import { publishDataBuilder } from "./utils/publishDataBuilder";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

function PublishStatisticContent({ user, navigate }) {
  const {
    data: crtfData,
    isLoading: isCrtfDataLoading,
    isError: isCrtfDataError,
    error: crtfDataError,
  } = useCrtfDataQuery(user);

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
      BUS_SN: true,
      BUS_ID: true,
      BUS_NAME: true,
      VEH_CHASSIS_CODE: false,
      VEH_ENGINE_CODE: false,
      VEH_BODY_CODE: false,
      BUS_VSCC: false,
      PUBLISH_DATE: true,
      NEXT_DATE: true,
      PUBLISH_MODE: false,
      COMPANY_NAME: false,
      COMPANY_CODE: false,
      USERNAME: false,
      CREATED_AT: false,
      UPDATED_AT: true,
      DELETED_AT: false,
      REMARK: false,
    },
  });

  const showColumns = watch();

  //***  render form checkbox ***
  const renderCheckbox = (key) => {
    const { id, label } = publishDataFields[key];
    return (
      <Controller
        key={id}
        name={id}
        control={control}
        render={({ field, fieldState }) => (
          <MDBCheckbox
            {...field}
            id={id}
            label={label}
            checked={field.value}
            error={fieldState.error}
            wrapperClass="me-4"
          />
        )}
      />
    );
  };
  // Gather all required fields to renderableKeys
  const renderableKeys = Object.keys(publishDataFields);
  // Make renderableKeys into "COL" columns
  const COL = 6;
  const chunkSize = Math.ceil(renderableKeys.length / COL);
  const checkboxColumns = Array.from({ length: COL }, (_, i) =>
    renderableKeys.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  const { data, columns } = useMemo(() => {
    // 在 crtfData 載入完成前，或 showColumns 還不存在時，使用範例資料
    if (!crtfData || !showColumns) {
      return {
        data: publishStatisticSampleData,
        columns: publishStatisticSampleColumns,
      };
    }
    return publishDataBuilder(crtfData, showColumns);
  }, [crtfData, showColumns]);

  console.log("Test data:", data);
  console.log("Test columns:", columns);

  if (isCrtfDataLoading || isCrtfDataError) {
    return (
      <ReturnLoadingError
        isLoading={isCrtfDataLoading}
        isError={isCrtfDataError}
        error={crtfDataError}
      />
    );
  }

  return (
    <MDBContainer className="my-5">
      <h3>
        {adminManagmentPageTitle}
        <MDBBadge className="mx-2" color="danger" light>
          {publishStatisticPageTitle}
        </MDBBadge>
      </h3>
      <hr className="hr" />
      <h4>
        <MDBBadge className="mx-2" color="info" light>
          {publishStatisticColCheckbox}
        </MDBBadge>
      </h4>
      <MDBRow center className="g-2 mt-2">
        {checkboxColumns.map((columnKeys, colIndex) => (
          <MDBCol size={12 / COL} key={`col-${colIndex}`}>
            {columnKeys.map(renderCheckbox)}
          </MDBCol>
        ))}
      </MDBRow>
      <hr className="hr" />
      <DataTable
        data={data}
        columns={columns}
        importType={false}
        handleDataImportSave={false}
      />
    </MDBContainer>
  );
}

export default function PublishStatistic() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: moduleFields,
    isLoading: isModuleFieldsLoading,
    isError: isModuleFieldsError,
    error: moduleFieldsError,
  } = useModuleFieldsQuery(user);

  useEffect(() => {
    if (moduleFields && !moduleFields.ADMIN_MANAGMENT?.PUBLISH_STATISTIC) {
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
  if (!moduleFields || !moduleFields.ADMIN_MANAGMENT?.PUBLISH_STATISTIC) {
    return null;
  }

  return <PublishStatisticContent user={user} navigate={navigate} />;
}
