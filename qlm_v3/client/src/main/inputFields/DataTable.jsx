import { useState, useMemo } from "react";
import {
  MDBTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBIcon,
} from "mdb-react-ui-kit";
import {
  dataTableDownloadBtn,
  dataTableNextBtn,
  dataTableNotFound,
  dataTablePreivousBtn,
  publishStatisticSearchLabel,
  publishStatisticShowRecordLabel,
  saveBtn,
} from "../../config";
import "../../css/general.css";
import * as XLSX from "xlsx";

const DataTable = ({ data, columns, importType, handleDataImportSave }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedAndFilteredData = useMemo(() => {
    let processedData = [...data];

    // Filtering
    if (searchTerm) {
      processedData = processedData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return processedData;
  }, [data, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredData.length / entriesPerPage);
  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <MDBIcon fas icon="sort" className="ms-2 text-muted" />;
    }
    if (sortConfig.direction === "ascending") {
      return <MDBIcon fas icon="sort-up" className="ms-2" />;
    }
    return <MDBIcon fas icon="sort-down" className="ms-2" />;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExcelExport = () => {
    // 1. Tranform data to excel header format
    const dataForExport = sortedAndFilteredData.map((item) => {
      const row = {};
      columns.forEach((col) => {
        row[col.label] = item[col.key];
      });
      return row;
    });

    // 2. Build worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // 3. Download launch
    XLSX.writeFile(wb, "DataExport.xlsx");
  };

  return (
    <div>
      <MDBRow className="mb-3">
        <MDBCol md="2">
          <span className="me-2">{publishStatisticShowRecordLabel}</span>
          <select
            className="form-select"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </MDBCol>
        <MDBCol md="4" className="offset-md-4">
          <MDBInput
            type="text"
            label={publishStatisticSearchLabel}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page
            }}
          />
        </MDBCol>
      </MDBRow>

      <MDBTable hover>
        <MDBTableHead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{ cursor: "pointer" }}
              >
                {col.label}
                {renderSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key} className="wrap-text">
                    {item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="wrap-text">
                {dataTableNotFound}
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>

      <MDBRow className="mt-3">
        <MDBCol md="6">
          第{" "}
          {Math.min(
            (currentPage - 1) * entriesPerPage + 1,
            sortedAndFilteredData.length
          )}{" "}
          到{" "}
          {Math.min(currentPage * entriesPerPage, sortedAndFilteredData.length)}{" "}
          筆，共 {sortedAndFilteredData.length} 筆
        </MDBCol>
        <MDBCol md="6">
          <MDBPagination className="justify-content-end">
            <MDBPaginationItem disabled={currentPage === 1}>
              <MDBPaginationLink
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {dataTablePreivousBtn}
              </MDBPaginationLink>
            </MDBPaginationItem>
            {[...Array(totalPages).keys()].map((number) => (
              <MDBPaginationItem
                key={number + 1}
                active={currentPage === number + 1}
              >
                <MDBPaginationLink onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </MDBPaginationLink>
              </MDBPaginationItem>
            ))}
            <MDBPaginationItem
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <MDBPaginationLink
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {dataTableNextBtn}
              </MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </MDBCol>
      </MDBRow>
      <MDBCol md="3">
        {importType && handleDataImportSave ? (
          <MDBBtn
            type="buttin"
            className="me-4"
            onClick={() => handleDataImportSave(data, columns, importType)}
          >
            {saveBtn}
          </MDBBtn>
        ) : (
          <MDBBtn onClick={handleExcelExport} type="button" className="me-4">
            <MDBIcon fas icon="file-excel" className="me-2" />
            {dataTableDownloadBtn}
          </MDBBtn>
        )}
      </MDBCol>
    </div>
  );
};

export default DataTable;
