/*
 * Utility Function
 * Flattens nested objects into a single-depth object for easier display
 * and manipulation in a flat file format like Excel.
 */

import * as XLSX from "xlsx";

interface FlatObject {
  [key: string]: any;
}

// Helper function to handle controlled flattening
const flattenProperties = (data: any, depth: number = 0): FlatObject => {
  let result: FlatObject = {};

  const recurse = (cur: any, prop: string, currentDepth: number): void => {
    if (Object(cur) !== cur || (currentDepth >= 1 && prop !== "")) {
      // Stop recursion if depth exceeds 1, unless it's the root
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i++) {
        recurse(cur[i], prop + "[" + i + "]", currentDepth + 1);
      }
      if (cur.length === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (let p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p, currentDepth + 1);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  };

  recurse(data, "", 0);
  return result;
};

// Type for item expected in propertiesCollection
interface CollectionItem {
  objectid: number;
  name: string;
  properties: any;
}

/* Utility Function
 * Converts a collection of property objects into an Excel sheet and saves it as a file.
 */

export const savePropertiesToExcel = (
  propertiesCollection: CollectionItem[]
): void => {
  const arrayToExport = propertiesCollection.map((item: CollectionItem) => ({
    objectid: item.objectid,
    name: item.name,
    // Flatten properties with controlled depth
    ...flattenProperties(item.properties, 0),
  }));

  // Flatten properties with controlled depth
  const worksheet = XLSX.utils.json_to_sheet(arrayToExport);
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  // Append sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
  // Write workbook to File
  XLSX.writeFile(workbook, "stepFileProperties.xlsx");
};
