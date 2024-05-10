export async function checkBucketExists(
  accessToken: string,
  bucketKey: string
): Promise<any> {
  const url = `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/details`;

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
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to check bucket:", error);
    throw error;
  }
}

export const createBucket = async (
  accessToken: string,
  bucketKey: string,
  policyKey: string = "transient"
): Promise<any> => {
  const bucketData = await checkBucketExists(accessToken, bucketKey);

  if (!bucketData) {
    const url = `https://developer.api.autodesk.com/oss/v2/buckets`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const body = JSON.stringify({
      bucketKey,
      policyKey,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`Failed to create bucket: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("created bucket: ", data);
      return data;
    } catch (error) {
      console.error("Failed to create bucket:", error);
      throw error;
    }
  }
};
