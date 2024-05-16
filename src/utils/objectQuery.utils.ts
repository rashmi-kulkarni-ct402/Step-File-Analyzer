// Utility function to check if an object contains a search query
export const objectContainsQuery = (obj: any, query: string): boolean => {
  // If the object is null or undefined, return false
  if (!obj) return false;
  // Iterate over each key in the object
  for (const key in obj) {
    // If the value is an object, recursively check if it contains the query
    if (typeof obj[key] === "object") {
      if (objectContainsQuery(obj[key], query)) {
        return true;
      }
      // return true, if match found
    } else if (
      obj[key].toString().toLowerCase().includes(query.toLowerCase())
    ) {
      return true;
    }
  }
  // return false if not found
  return false;
};
