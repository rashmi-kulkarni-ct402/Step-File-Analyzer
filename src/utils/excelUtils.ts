// const savePropertiesToExcel = (properties) => {
//   const worksheet = XLSX.utils.json_to_sheet(properties);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

//   // Write the file
//   XLSX.writeFile(workbook, "fileProperties.xlsx");
// };

import * as XLSX from "xlsx";

export const savePropertiesToExcel = (properties: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(properties);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  // Write the file
  XLSX.writeFile(workbook, "fileProperties.xlsx");
};
