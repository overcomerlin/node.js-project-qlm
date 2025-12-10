import { forwardRef, useRef } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import "../../css/crtfPrint.css";
import {
  printPreview,
  crtfTemplate,
  modelCode,
  closePreview,
  printCrtf,
  storedSuccess,
  storedFail,
} from "../../config";
import { usePrintTuneQuery } from "../dataAccess/usePrintTuneQuery";
import { useAuth } from "../../utils/authContext";
import ReturnLoadingError from "../utils/returnLoadingError";
import { toast } from "react-toastify";

const PrintableContent = forwardRef(
  (
    {
      BUS_NAME,
      BUS_ID,
      VEH_CODE,
      MODEL_SN,
      BUS_VSCC,
      PUBLISH_DATE,
      NEXT_DATE,
      style,
    },
    ref
  ) => {
    return (
      <div ref={ref} style={style} className="templete-print-preview">
        <div
          className="no-print"
          dangerouslySetInnerHTML={{ __html: crtfTemplate }}
        />
        <div className="busName-print-preview">{BUS_NAME}</div>
        <div className="busId-print-preview">{BUS_ID}</div>
        <div className="vehCode-print-preview">{VEH_CODE}</div>
        <div className="modelCode-print-preview">{MODEL_SN}</div>
        <div className="vscc-print-preview">{BUS_VSCC}</div>
        <div className="publishDate-print-preview">{PUBLISH_DATE}</div>
        <div className="nextDate-print-preview">{NEXT_DATE}</div>
      </div>
    );
  }
);

function PrintContent({
  modalToggle,
  toggleOpen,
  printData,
  printTuneFields,
  navigate,
  saveCrtfMutation,
  initFormData,
}) {
  const componentRef = useRef();

  const { username, saveType, ...data } = printData;

  const vehCode =
    printData.VEH_CHASSIS_CODE ||
    printData.VEH_ENGINE_CODE ||
    printData.VEH_BODY_CODE;

  const modelSN = Object.keys(modelCode).reduce((foundValue, key) => {
    if (printData?.BUS_SN?.includes(key)) return modelCode[key];
    return foundValue;
  }, undefined);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onAfterPrint: () => {
      saveCrtfMutation.mutate(
        { data, saveType },
        {
          onSuccess: (data, variables) => {
            const busSN = data.crtfNo.split("_")[0];
            const busID = data.crtfNo.split("_")[1];
            console.log("onSuccess:", `${busSN}_${busID}`);
            toast.success(
              `${crtf} ${initFormData.BUS_SN.label}(${busSN}) ${initFormData.BUS_ID.label}(${busID}) ${storedSuccess}`
            );
            navigate("/");
          },
          onError: (error, variables) => {
            toast.error(error || storedFail);
          },
          onSettled: () => {
            toggleOpen(false);
          },
        }
      );
    },
  });

  return (
    <MDBModal
      staticBackdrop
      tabIndex="-1"
      open={modalToggle}
      onClose={() => {
        toggleOpen(false);
      }}
    >
      <MDBModalDialog centered size="xl">
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{printPreview}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => {
                toggleOpen(false);
              }}
            />
          </MDBModalHeader>
          <MDBModalBody>
            <PrintableContent
              ref={componentRef}
              style={{
                "--tune-busName-top": `${printTuneFields?.BUS_NAME[1] || 0}mm`,
                "--tune-busName-left": `${printTuneFields?.BUS_NAME[0] || 0}mm`,
                "--tune-busName-fontSize": `${
                  printTuneFields?.BUS_NAME[2] || 12
                }pt`,
                "--tune-busId-top": `${printTuneFields?.BUS_ID[1] || 0}mm`,
                "--tune-busId-left": `${printTuneFields?.BUS_ID[0] || 0}mm`,
                "--tune-busId-fontSize": `${
                  printTuneFields?.BUS_ID[2] || 12
                }pt`,
                "--tune-vehCode-top": `${printTuneFields?.VEH_CODE[1] || 0}mm`,
                "--tune-vehCode-left": `${printTuneFields?.VEH_CODE[0] || 0}mm`,
                "--tune-vehCode-fontSize": `${
                  printTuneFields?.VEH_CODE[2] || 12
                }pt`,
                "--tune-modelCode-top": `${
                  printTuneFields?.MODEL_SN[1] || 0
                }mm`,
                "--tune-modelCode-left": `${
                  printTuneFields?.MODEL_SN[0] || 0
                }mm`,
                "--tune-modelCode-fontSize:": `${
                  printTuneFields?.MODEL_SN[2] || 12
                }pt`,
                "--tune-vscc-top": `${printTuneFields?.BUS_VSCC[1] || 0}mm`,
                "--tune-vscc-left": `${printTuneFields?.BUS_VSCC[0] || 0}mm`,
                "--tune-vscc-fontSize": `${
                  printTuneFields?.BUS_VSCC[2] || 12
                }pt`,
                "--tune-publishDate-top": `${
                  printTuneFields?.PUBLISH_DATE[1] || 0
                }mm`,
                "--tune-publishDate-left": `${
                  printTuneFields?.PUBLISH_DATE[0] || 0
                }mm`,
                "--tune-publishDate-fontSize": `${
                  printTuneFields?.PUBLISH_DATE[2] || 12
                }pt`,
                "--tune-nextDate-top": `${
                  printTuneFields?.NEXT_DATE[1] || 0
                }mm`,
                "--tune-nextDate-left": `${
                  printTuneFields?.NEXT_DATE[0] || 0
                }mm`,
                "--tune-nextDate-fontSize": `${
                  printTuneFields?.NEXT_DATE[2] || 12
                }pt`,
              }}
              BUS_NAME={printData?.BUS_NAME}
              BUS_ID={printData?.BUS_ID}
              VEH_CODE={vehCode}
              MODEL_SN={modelSN}
              BUS_VSCC={printData?.BUS_VSCC}
              PUBLISH_DATE={
                printData?.PUBLISH_DATE &&
                format(new Date(printData.PUBLISH_DATE), "yyyy 年 MM 月 dd 日")
              }
              NEXT_DATE={
                printData?.NEXT_DATE &&
                format(new Date(printData.NEXT_DATE), "yyyy 年 MM 月 dd 日")
              }
              user={{ username: printData?.username }}
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              onClick={() => {
                toggleOpen(false);
              }}
            >
              {closePreview}
            </MDBBtn>
            <MDBBtn onClick={handlePrint}>{printCrtf}</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}

export default function PrintModal({
  modalToggle,
  toggleOpen,
  printData,
  navigate,
  toast,
  saveCrtfMutation,
  initFormData,
}) {
  const { user } = useAuth();
  const {
    data: printTuneFields,
    isLoading: isPrintTuneFieldsLoading,
    isError: isPrintTuneFieldsError,
    error: printTuneFieldsError,
  } = usePrintTuneQuery(user);

  if (isPrintTuneFieldsLoading || isPrintTuneFieldsError) {
    return (
      <ReturnLoadingError
        isLoading={isPrintTuneFieldsLoading}
        isError={isPrintTuneFieldsError}
        error={printTuneFieldsError}
      />
    );
  }

  return (
    <PrintContent
      modalToggle={modalToggle}
      toggleOpen={toggleOpen}
      printData={printData}
      printTuneFields={printTuneFields}
      navigate={navigate}
      toast={toast}
      saveCrtfMutation={saveCrtfMutation}
      initFormData={initFormData}
    />
  );
}
