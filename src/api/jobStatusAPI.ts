export async function checkJobStatus(
  urn: string,
  accessToken: string,
  callback: (urn: string) => void
): Promise<void> {
  const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (data.status === "success") {
    callback(urn);
  } else if (data.status === "inprogress" || data.status === "pending") {
    setTimeout(() => checkJobStatus(urn, accessToken, callback), 1000); // Retry after 5 seconds
  } else {
    throw new Error("Translation failed with status " + data.status);
  }
}
