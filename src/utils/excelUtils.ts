import * as XLSX from "xlsx";

export const savePropertiesToExcel = (properties: any) => {
  const arrayToExport = Array.isArray(properties) ? properties : [properties];
  const worksheet = XLSX.utils.json_to_sheet(arrayToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  XLSX.writeFile(workbook, "fileProperties.xlsx");
};
