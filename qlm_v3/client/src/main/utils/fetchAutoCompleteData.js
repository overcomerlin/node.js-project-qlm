import { format } from "date-fns";
export const fetchAutoCompleteData = ({ autoCompleteData, fields }) => {
  let initAccumulator = Object.keys(fields).reduce(
    (acc, curr) => {
      if (fields[curr]) {
        acc[curr] = [];
      }
      return acc;
    },
    { crtfNo: [], HISTORIC_REMARK: [] }
  );

  // If autoCompleteData is null or undefined, do nothing.
  if (!autoCompleteData) return null;

  const data = autoCompleteData.reduce((acc, curr) => {
    if (fields.BUILD_DATE) {
      acc.BUILD_DATE.push(
        format(new Date(curr.crtfField.BUILD_DATE), "yyyy-MM-dd")
      );
    }
    if (fields.BUS_ID) {
      acc.BUS_ID.push(curr.crtfField.BUS_ID);
    }
    if (fields.BUS_NAME) {
      acc.BUS_NAME.push(curr.crtfField.BUS_NAME);
    }
    if (fields.BUS_SN) {
      acc.BUS_SN.push(curr.crtfField.BUS_SN);
    }
    if (fields.BUS_VSCC) {
      acc.BUS_VSCC.push(curr.crtfField.BUS_VSCC);
    }
    if (fields.CLERK_NAME) {
      acc.CLERK_NAME.push(curr.crtfField.CLERK_NAME);
    }
    if (fields.CONTACT_ADDR) {
      acc.CONTACT_ADDR.push(curr.crtfField.CONTACT_ADDR);
    }
    if (fields.CONTACT_NAME) {
      acc.CONTACT_NAME.push(curr.crtfField.CONTACT_NAME);
    }
    if (fields.CONTACT_PHONE) {
      acc.CONTACT_PHONE.push(curr.crtfField.CONTACT_PHONE);
    }
    if (fields.CRTF_SN) {
      acc.CRTF_SN.push(curr.crtfField.CRTF_SN);
    }
    acc.HISTORIC_REMARK.push(curr.remark);
    if (fields.NEXT_DATE) {
      acc.NEXT_DATE.push(
        format(new Date(curr.crtfField.NEXT_DATE), "yyyy-MM-dd")
      );
    }
    if (fields.PUBLISH_DATE) {
      acc.PUBLISH_DATE.push(
        format(new Date(curr.crtfField.PUBLISH_DATE), "yyyy-MM-dd")
      );
    }
    if (fields.PUBLISH_MODE) {
      acc.PUBLISH_MODE.push(curr.category);
    }
    if (fields.TECHNICIAN_NAME) {
      acc.TECHNICIAN_NAME.push(curr.crtfField.TECHNICIAN_NAME);
    }
    if (fields.UNIT_NAME) {
      acc.UNIT_NAME.push(curr.crtfField.UNIT_NAME);
    }
    if (fields.VEH_BODY_CODE) {
      acc.VEH_BODY_CODE.push(curr.crtfField.VEH_BODY_CODE);
    }
    if (fields.VEH_CHASSIS_CODE) {
      acc.VEH_CHASSIS_CODE.push(curr.crtfField.VEH_CHASSIS_CODE);
    }
    if (fields.VEH_ENGINE_CODE) {
      acc.VEH_ENGINE_CODE.push(curr.crtfField.VEH_ENGINE_CODE);
    }
    acc.crtfNo.push(curr.crtfNo);
    return acc;
  }, initAccumulator);

  return data;
};
