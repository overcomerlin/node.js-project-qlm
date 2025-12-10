import { none, publishDataFields } from "../../config";
import { format } from "date-fns";

export const publishDataBuilder = (crtfData, showColumns) => {
  const crtfDataTmp = crtfData.map((item) => {
    return Object.keys(item).reduce((acc, curr) => {
      if (curr === "company" || curr === "createdBy" || curr === "crtfField") {
        return { ...acc, ...item[curr] };
      } else if (curr === "remark") {
        return {
          ...acc,
          remark: Object.keys(item[curr])
            .reduce((remark_acc, remark_curr) => {
              remark_acc += remark_curr + ":" + item[curr][remark_curr] + "\n";
              return remark_acc;
            }, "")
            .slice(0, -1),
        };
      } else {
        return { ...acc, [curr]: item[curr] };
      }
    }, {});
  });

  const columns = Object.keys(showColumns).reduce((acc, curr) => {
    if (showColumns[curr]) {
      acc.push({
        label: publishDataFields[curr].label,
        key: publishDataFields[curr].key,
      });
    }
    return acc;
  }, []);

  // 根據 showColumns 過濾 crtfDataTmp 的欄位
  const filteredData = crtfDataTmp.map((item) => {
    const newItem = {};
    columns.forEach((col) => {
      if (item[col.key] !== undefined) {
        if (
          col.key === "PUBLISH_DATE" ||
          col.key === "NEXT_DATE" ||
          col.key === "createdAt" ||
          col.key === "updatedAt" ||
          col.key === "deletedAt"
        ) {
          newItem[col.key] = item[col.key]
            ? format(new Date(item[col.key]), "yyyy-MM-dd_HH:mm:ss")
            : none;
        } else newItem[col.key] = item[col.key];
      }
    });
    return newItem;
  });

  return { data: filteredData, columns: columns };
};
