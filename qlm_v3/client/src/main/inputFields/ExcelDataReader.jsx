import { useState } from "react";
import { MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import * as XLSX from "xlsx";
import DataTable from "./DataTable";
import * as Yup from "yup";
import {
  dataImpoerDateFormatEmpty,
  dataImportCaution,
  dataImportDataDuplicatedCompanyCode,
  dataImportDataDuplicatedUsername,
  dataImportDataFields,
  dataImportDataFormatError,
  dataImportDataNotExistedCompanyCode,
  dataImportFileUpload,
  dataImportHeaderError,
  dataImportSampleFileDownload,
  none,
  yupBUS_ID_Hint,
  yupBUS_NAME_Hint,
  yupBUS_SN_Hint,
  yupDATE_Hint,
} from "../../config";
import { toast } from "react-toastify";

const getValidationSchema = (importType, allUserCompany) => {
  // Create an efficient lookup map from companyId to usernames.
  const usersByCompanyId = allUserCompany.username.reduce(
    (acc, username, index) => {
      const companyId = allUserCompany.companyId[index];
      if (!acc.has(companyId)) {
        acc.set(companyId, []);
      }
      acc.get(companyId).push(username);
      return acc;
    },
    new Map()
  );

  // Create the final table mapping companyCode to its list of users.
  const usernameCompanyCodeTable = allUserCompany.companyCode.reduce(
    (acc, companyCode, index) => {
      const companyId = allUserCompany.id[index];
      // Get users from the map, defaulting to an empty array if none are found.
      acc[companyCode] = usersByCompanyId.get(companyId) || [];
      return acc;
    },
    {}
  );

  const requiredStr = (label) =>
    Yup.string()
      .nullable()
      .required(`${label} 不可為空`)
      .test(
        "is-not-none",
        `${label} 不可為空`,
        (value) => value !== none && value !== null && value !== undefined
      );

  const schemas = {
    user: Yup.object({
      USERNAME: requiredStr(dataImportDataFields.user[0].label).test(
        "is-unique-username",
        ({ originalValue }) =>
          `${dataImportDataDuplicatedUsername}: ${originalValue}`,
        // the new USERNAME should not exist in the username list in database
        (value) => !allUserCompany.username.includes(value)
      ),
      COMPANY_CODE: requiredStr(dataImportDataFields.user[1].label).test(
        "is-unique-companycode",
        ({ originalValue }) =>
          `${dataImportDataNotExistedCompanyCode}: ${originalValue}`,
        // the new USERNAME should belong to an existed company in database
        (value) => allUserCompany.companyCode.includes(value)
      ),
      PASSWORD: requiredStr(dataImportDataFields.user[2].label),
    }),
    company: Yup.object({
      COMPANY_CODE: requiredStr(dataImportDataFields.company[0].label).test(
        "is-unique-companycode",
        ({ originalValue }) =>
          `${dataImportDataDuplicatedCompanyCode}: ${originalValue}`,
        (value) => !allUserCompany.companyCode.includes(value)
      ),
      COMPANY_NAME: requiredStr(dataImportDataFields.company[1].label),
    }),
    crtf: Yup.object({
      COMPANY_CODE: requiredStr(dataImportDataFields.company[0].label).test(
        "company-exists",
        ({ originalValue }) =>
          `${dataImportDataNotExistedCompanyCode}: ${originalValue}`,
        (value) => allUserCompany.companyCode.includes(value)
      ),
      USERNAME: requiredStr(dataImportDataFields.user[0].label).test(
        "username-exists-in-company",
        ({ value, parent }) =>
          `使用者 ${value} 不存在於公司 ${parent.COMPANY_CODE} 中`,
        function (value) {
          const companyCode = this.parent.COMPANY_CODE;
          const usersInCompany = usernameCompanyCodeTable[companyCode] || [];
          return usersInCompany.includes(value);
        }
      ),
      BUS_SN: requiredStr(dataImportDataFields.crtf[0].label).matches(
        /^J[0-9]{3}[SU]-[0-9]{4}-[0-9]{4}$/,
        yupBUS_SN_Hint
      ),
      BUS_ID: requiredStr(dataImportDataFields.crtf[1].label).matches(
        /^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/,
        yupBUS_ID_Hint
      ),
      BUS_NAME: requiredStr(dataImportDataFields.crtf[2].label).matches(
        /^(?=.*[\u4e00-\u9fa5])[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
        yupBUS_NAME_Hint
      ),
      BUS_VSCC: requiredStr(dataImportDataFields.crtf[6].label),
      BUILD_DATE: requiredStr(dataImportDataFields.crtf[10].label).matches(
        /^\d{4}:(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])_([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        ({ value }) => `${value} ${yupDATE_Hint}`
      ),
      PUBLISH_DATE: requiredStr(dataImportDataFields.crtf[11].label).matches(
        /^\d{4}:(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])_([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        ({ value }) => `${value} ${yupDATE_Hint}`
      ),
      NEXT_DATE: requiredStr(dataImportDataFields.crtf[12].label).matches(
        /^\d{4}:(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])_([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        ({ value }) => `${value} ${yupDATE_Hint}`
      ),
      PUBLISH_MODE: requiredStr(dataImportDataFields.crtf[13].label),
      VEH_CHASSIS_CODE: Yup.string().nullable(),
      VEH_ENGINE_CODE: Yup.string().nullable(),
      VEH_BODY_CODE: Yup.string().nullable(),
    }).test(
      "one-of-veh-codes-required",
      `${dataImpoerDateFormatEmpty} (${dataImportDataFields.crtf[3].label}, ${dataImportDataFields.crtf[4].label}, ${dataImportDataFields.crtf[5].label} 至少需填寫一項)`,
      (value) =>
        (value.VEH_CHASSIS_CODE !== none && value.VEH_CHASSIS_CODE) ||
        (value.VEH_ENGINE_CODE !== none && value.VEH_ENGINE_CODE) ||
        (value.VEH_BODY_CODE !== none && value.VEH_BODY_CODE)
    ),
  };

  return schemas[importType];
};

const ExcelDataReader = ({
  importType,
  allUserCompany,
  handleDataImportSave,
}) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (e) => {
    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      // read the spreadsheet
      const data = evt.target.result;
      const wb = XLSX.read(data, { type: "array" });

      // fetch the name of the first sheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Transform spreadsheet to JSON object
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (jsonData.length > 0) {
        // the data table header
        const header = jsonData[0];
        // Check if any header cell is null or undefined
        for (let i = 0; i < header.length; i++) {
          if (
            header[i] === null ||
            header[i] === undefined ||
            header[i].trim() === ""
          ) {
            toast.error(dataImportHeaderError);
            setColumns([]);
            setData([]);
            file = null; // Reset file object
            return;
          }
        }

        const newColumns = header.map((h, i) => ({ label: h, key: h }));

        // Rest of content... the import data
        let newData = jsonData.slice(1).map((row) => {
          const rowData = {};
          header.forEach((h, index) => {
            rowData[h] = row[index];
          });
          return rowData;
        });

        // Check the structure of newColumns
        const expectedFields = dataImportDataFields[importType];
        if (
          newColumns.length < expectedFields.length ||
          !expectedFields.every(
            (field, i) => field.label === newColumns[i].label
          )
        ) {
          toast.error(dataImportDataFormatError);
          setColumns([]);
          setData([]);
          return;
        }

        // 2. data transform and validation
        const validationSchema = getValidationSchema(
          importType,
          allUserCompany
        );
        const validatedData = [];
        const validationErrors = [];

        // change label-based fields to key-based fields
        const processedData = newData.map((row) => {
          const rowData = {};
          expectedFields.forEach((field, index) => {
            const originalValue = row[field.label];
            // Replace undefined and null value with "無"
            if (
              originalValue === undefined ||
              originalValue === null ||
              (typeof originalValue === "string" && originalValue.trim() === "")
            ) {
              rowData[field.key] = none;
            } else {
              rowData[field.key] = originalValue;
            }
          });
          return rowData;
        });

        // Pre-process: check if duplicated USERNAME in import_user.xlsx
        if (importType === "user") {
          const usernameCounts = new Map();
          processedData.forEach((row) => {
            const username = row.USERNAME;
            if (username && username !== none) {
              usernameCounts.set(
                username,
                (usernameCounts.get(username) || 0) + 1
              );
            }
          });
          const duplicates = [];
          for (const [username, count] of usernameCounts.entries()) {
            if (count > 1) {
              duplicates.push(username);
            }
          }
          if (duplicates.length > 0) {
            toast.error(
              `檔案內部包含重複的使用者帳號: ${duplicates.join(", ")}`
            );
            setColumns([]);
            setData([]);
            return;
          }
        }

        // Pre-process: check if duplicated COMPANY_CODE in import_company.xlsx
        if (importType === "company") {
          const companyCodeCounts = new Map();
          processedData.forEach((row) => {
            const companyCode = row.COMPANY_CODE;
            if (companyCode && companyCode !== none) {
              companyCodeCounts.set(
                companyCode,
                (companyCodeCounts.get(companyCode) || 0) + 1
              );
            }
          });
          const duplicates = [];
          for (const [companyCode, count] of companyCodeCounts.entries()) {
            if (count > 1) {
              duplicates.push(companyCode);
            }
          }
          if (duplicates.length > 0) {
            toast.error(`檔案內部包含重複的公司代碼: ${duplicates.join(", ")}`);
            setColumns([]);
            setData([]);
            return;
          }
        }

        // Each row validation
        for (let i = 0; i < processedData.length; i++) {
          try {
            const row = processedData[i];
            validationSchema.validateSync(row, { abortEarly: false });
            validatedData.push(row);
          } catch (err) {
            validationErrors.push(`第 ${i + 1} 行: ${err.errors.join(", ")}`);
          }
        }

        // Update the state
        if (validationErrors.length > 0) {
          toast.error(`資料驗證失敗: ${validationErrors.map((e) => `${e}`)}`);
          setColumns([]);
          setData([]);
        } else {
          const finalColumns = expectedFields.map((field) => ({
            label: field.label,
            key: field.key,
          }));
          setColumns(finalColumns);
          setData(validatedData);
          toast.success("資料驗證成功！");
        }
      } else {
        toast.error(dataImpoerDateFormatEmpty);
        setColumns([]);
        setData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  let file_link = "/import_user.xlsx";
  if (importType === "company") {
    file_link = "/import_company.xlsx";
  } else if (importType === "crtf") {
    file_link = "/import_crtf.xlsx";
  }

  return (
    <>
      <MDBRow center className="g-2 mt-2">
        <MDBCol size="5">
          <span className="me-2">{dataImportFileUpload}</span>
          <MDBInput
            type="file"
            label=""
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="mb-4"
          />
        </MDBCol>
        <MDBCol size="7">
          <small>
            {dataImportCaution}
            <a href={file_link} download>
              {dataImportSampleFileDownload}
            </a>
          </small>
        </MDBCol>
      </MDBRow>
      {data.length > 0 && (
        <DataTable
          data={data}
          columns={columns}
          importType={importType}
          handleDataImportSave={handleDataImportSave}
        />
      )}
    </>
  );
};

export default ExcelDataReader;
