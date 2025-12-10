import { useState } from "react";
import { MDBContainer, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { Popover } from "./printTune/popover.jsx"; // 更新引用
import {
  crtfTemplate,
  horizontalTune,
  numberMust,
  requiredField,
  verticalTune,
  printTuneData,
  loadingData,
  saveBtn,
  printTuneDataSaved,
  textSizeTune,
} from "../config.js";
import "../css/crtfPrint.css";
import { usePrintTuneQuery } from "./dataAccess/usePrintTuneQuery.js";
import { useAuth } from "../utils/authContext.jsx";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputNumberFieldGeneral from "./printTune/inputNumberFieldGeneral.jsx";
import "../css/popover.css";
import { useSavePrintTuneMutation } from "./dataAccess/useSavePrintTuneMutation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReturnLoadingError from "./utils/returnLoadingError.jsx";

const validationSchema = Yup.object({
  BUS_NAME_X: Yup.number().typeError(numberMust).required(requiredField),
  BUS_NAME_Y: Yup.number().typeError(numberMust).required(requiredField),
  BUS_NAME_sz: Yup.number().typeError(numberMust).required(requiredField),
  BUS_ID_X: Yup.number().typeError(numberMust).required(requiredField),
  BUS_ID_Y: Yup.number().typeError(numberMust).required(requiredField),
  BUS_ID_sz: Yup.number().typeError(numberMust).required(requiredField),
  VEH_CODE_X: Yup.number().typeError(numberMust).required(requiredField),
  VEH_CODE_Y: Yup.number().typeError(numberMust).required(requiredField),
  VEH_CODE_sz: Yup.number().typeError(numberMust).required(requiredField),
  MODEL_SN_X: Yup.number().typeError(numberMust).required(requiredField),
  MODEL_SN_Y: Yup.number().typeError(numberMust).required(requiredField),
  MODEL_SN_sz: Yup.number().typeError(numberMust).required(requiredField),
  BUS_VSCC_X: Yup.number().typeError(numberMust).required(requiredField),
  BUS_VSCC_Y: Yup.number().typeError(numberMust).required(requiredField),
  BUS_VSCC_sz: Yup.number().typeError(numberMust).required(requiredField),
  PUBLISH_DATE_X: Yup.number().typeError(numberMust).required(requiredField),
  PUBLISH_DATE_Y: Yup.number().typeError(numberMust).required(requiredField),
  PUBLISH_DATE_sz: Yup.number().typeError(numberMust).required(requiredField),
  NEXT_DATE_X: Yup.number().typeError(numberMust).required(requiredField),
  NEXT_DATE_Y: Yup.number().typeError(numberMust).required(requiredField),
  NEXT_DATE_sz: Yup.number().typeError(numberMust).required(requiredField),
});

export default function CrtfPrintTune() {
  const { user } = useAuth();
  const {
    data: printFields,
    isLoading,
    isError,
    error,
  } = usePrintTuneQuery(user);

  const returnLoadingError = (
    <ReturnLoadingError isLoading={isLoading} isError={isError} error={error} />
  );

  if (isLoading || isError) {
    return returnLoadingError;
  }

  return <PrintTuneFields printFields={printFields} />;
}

function PrintTuneFields({ printFields }) {
  const [busNamePopoverTarget, setBusNamePopoverTarget] = useState(null);
  const [busIDPopoverTarget, setBusIDPopoverTarget] = useState(null);
  const [vehCodePopoverTarget, setVehCodePopoverTarget] = useState(null);
  const [modelCodePopoverTarget, setModelCodePopoverTarget] = useState(null);
  const [vsccPopoverTarget, setVsccPopoverTarget] = useState(null);
  const [publishDatePopoverTarget, setPublishDatePopoverTarget] =
    useState(null);
  const [nextDatePopoverTarget, setNextDatePopoverTarget] = useState(null);

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
      BUS_NAME_X: printFields.BUS_NAME[0],
      BUS_NAME_Y: printFields.BUS_NAME[1],
      BUS_NAME_sz: printFields.BUS_NAME[2],
      BUS_ID_X: printFields.BUS_ID[0],
      BUS_ID_Y: printFields.BUS_ID[1],
      BUS_ID_sz: printFields.BUS_ID[2],
      VEH_CODE_X: printFields.VEH_CODE[0],
      VEH_CODE_Y: printFields.VEH_CODE[1],
      VEH_CODE_sz: printFields.VEH_CODE[2],
      MODEL_SN_X: printFields.MODEL_SN[0],
      MODEL_SN_Y: printFields.MODEL_SN[1],
      MODEL_SN_sz: printFields.MODEL_SN[2],
      BUS_VSCC_X: printFields.BUS_VSCC[0],
      BUS_VSCC_Y: printFields.BUS_VSCC[1],
      BUS_VSCC_sz: printFields.BUS_VSCC[2],
      PUBLISH_DATE_X: printFields.PUBLISH_DATE[0],
      PUBLISH_DATE_Y: printFields.PUBLISH_DATE[1],
      PUBLISH_DATE_sz: printFields.PUBLISH_DATE[2],
      NEXT_DATE_X: printFields.NEXT_DATE[0],
      NEXT_DATE_Y: printFields.NEXT_DATE[1],
      NEXT_DATE_sz: printFields.NEXT_DATE[2],
    },
  });
  const navigate = useNavigate();
  const savePrintTuneMutation = useSavePrintTuneMutation();
  const handelSave = (data) => {
    savePrintTuneMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          toast.success(printTuneDataSaved + `, (${response?.message})`);
          navigate("/");
        },
      }
    );
  };

  return (
    <MDBContainer className="my-5 crtf-templete-mdbcontainer">
      <form>
        <div
          className="crtf-templete"
          dangerouslySetInnerHTML={{ __html: crtfTemplate }}
        />
        <div ref={setBusNamePopoverTarget} className="busName-print-tune">
          {printTuneData.BUS_NAME.value}
        </div>
        <div ref={setBusIDPopoverTarget} className="busId-print-tune">
          {printTuneData.BUS_ID.value}
        </div>
        <div ref={setVehCodePopoverTarget} className="vehCode-print-tune">
          {printTuneData.VEH_CODE.value}
        </div>
        <div ref={setModelCodePopoverTarget} className="modelCode-print-tune">
          {printTuneData.MODEL_SN.value}
        </div>
        <div ref={setVsccPopoverTarget} className="vscc-print-tune">
          {printTuneData.BUS_VSCC.value}
        </div>
        <div
          ref={setPublishDatePopoverTarget}
          className="publishDate-print-tune"
        >
          {printTuneData.PUBLISH_DATE.value}
        </div>
        <div ref={setNextDatePopoverTarget} className="nextDate-print-tune">
          {printTuneData.NEXT_DATE.value}
        </div>
        {Object.entries(printTuneData).map(([key, value]) => {
          let targetTmp = null;
          if (key === "BUS_NAME") {
            targetTmp = busNamePopoverTarget;
          } else if (key === "BUS_ID") {
            targetTmp = busIDPopoverTarget;
          } else if (key === "VEH_CODE") {
            targetTmp = vehCodePopoverTarget;
          } else if (key === "MODEL_SN") {
            targetTmp = modelCodePopoverTarget;
          } else if (key === "BUS_VSCC") {
            targetTmp = vsccPopoverTarget;
          } else if (key === "PUBLISH_DATE") {
            targetTmp = publishDatePopoverTarget;
          } else if (key === "NEXT_DATE") {
            targetTmp = nextDatePopoverTarget;
          }
          return (
            <div key={"div_" + key}>
              {targetTmp && (
                <Popover
                  referenceElement={targetTmp}
                  placement={value.placement}
                  position={value.position}
                >
                  <p>{value.title}</p>
                  <Controller
                    name={key + "_X"}
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumberFieldGeneral
                        {...field}
                        id={key + "_X"}
                        label={horizontalTune}
                        error={fieldState.error}
                        readOnly={false}
                        disabled={false}
                      />
                    )}
                  />
                  <Controller
                    name={key + "_Y"}
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumberFieldGeneral
                        {...field}
                        id={key + "_Y"}
                        label={verticalTune}
                        error={fieldState.error}
                        readOnly={false}
                        disabled={false}
                      />
                    )}
                  />
                  <Controller
                    name={key + "_sz"}
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumberFieldGeneral
                        {...field}
                        id={key + "_sz"}
                        label={textSizeTune}
                        error={fieldState.error}
                        readOnly={false}
                        disabled={false}
                      />
                    )}
                  />
                </Popover>
              )}
            </div>
          );
        })}
        <MDBBtn
          className="submit-btn"
          onClick={handleSubmit(handelSave)}
          disabled={false}
        >
          {saveBtn}
        </MDBBtn>
      </form>
    </MDBContainer>
  );
}
