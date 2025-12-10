export default function getFunctionlity(fieldStr, funcStr) {
  const fieldStrTmp = [];
  const funcStrTmp = [];
  for (const char of fieldStr)
    if (char === "1") fieldStrTmp.push(true);
    else fieldStrTmp.push(false);
  for (const char of funcStr)
    if (char === "1") funcStrTmp.push(true);
    else funcStrTmp.push(false);
  return {
    FIELDS: {
      BUS_SN: fieldStrTmp[0],
      BUS_ID: fieldStrTmp[1],
      BUS_NAME: fieldStrTmp[2],
      VEH_CHASSIS_CODE: fieldStrTmp[3],
      VEH_ENGINE_CODE: fieldStrTmp[4],
      VEH_BODY_CODE: fieldStrTmp[5],
      BUS_VSCC: fieldStrTmp[6],
      CONTACT_NAME: fieldStrTmp[7],
      CONTACT_PHONE: fieldStrTmp[8],
      CONTACT_ADDR: fieldStrTmp[9],
      BUILD_DATE: fieldStrTmp[10],
      PUBLISH_DATE: fieldStrTmp[11],
      NEXT_DATE: fieldStrTmp[12],
      PUBLISH_MODE: fieldStrTmp[13],
      CRTF_SN: fieldStrTmp[14],
      TECHNICIAN_NAME: fieldStrTmp[15],
      CLERK_NAME: fieldStrTmp[16],
      UNIT_NAME: fieldStrTmp[17],
    },
    ISSUE: funcStrTmp[0],
    RENEW: funcStrTmp[1],
    REPLACE: funcStrTmp[2],
    PRINT_TUNE: funcStrTmp[3],
    STATISTIC: funcStrTmp[4], // reserved field
    USER_MANAGMENT_OPEN: funcStrTmp[5],
    ADMIN_MANAGMENT_OPEN: funcStrTmp[6],
    USER_MANAGMENT: {
      USER_DATA: funcStrTmp[7],
      FUNC_TUNE: funcStrTmp[8],
      NEW_USER: funcStrTmp[9],
      NEW_COMPANY: funcStrTmp[10],
    },
    ADMIN_MANAGMENT: {
      PRINT_CRTF_SN: funcStrTmp[11],
      PUBLISH_STATISTIC: funcStrTmp[12],
      VEH_SEARCH: funcStrTmp[13],
      DATA_IMPORT: funcStrTmp[14],
      BATCH_PRINT: funcStrTmp[15],
    },
  };
}
