/*
 * API Call to Upload a File to a Bucket on Autodesk's Object Storage Service
 * This function uploads a file to a specified bucket. The file is identified by a bucket key and file name.
 */
export async function uploadFileToBucket(
  file: File,
  accessToken: string,
  bucketKey: string
): Promise<any> {
  const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${encodeURIComponent(
    file.name
  )}`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to bucket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to upload file to bucket:", error);
    throw error;
  }
}

/*
 * API Call to Check if a File is Successfully Uploaded to a Bucket on Autodesk's Object Storage Service
 * This function checks the status of a file in a bucket, identified by the bucket key and object name.
 */
export async function checkFileUploaded(
  bucketKey: string,
  objectName: string,
  accessToken: string
): Promise<any> {
  const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectName}/details`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("File not found.");
        return null;
      }
      throw new Error("Error checking file: " + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to check if file is uploaded:", error);
    return null;
  }
}
