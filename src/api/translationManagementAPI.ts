/*
 * API Call to Start a Translation Job on Autodesk's Model Derivative API
 * This function initiates a translation job to convert a model into a format that can be viewed on Autodesk platforms.
 */
export async function translateFile(
  objectId: string,
  accessToken: string
): Promise<any> {
  const urn = btoa(objectId).replace(/=/g, "");
  const url =
    "https://developer.api.autodesk.com/modelderivative/v2/designdata/job";
  const payload = {
    input: {
      urn,
    },
    output: {
      formats: [
        {
          type: "svf",
          views: ["2d", "3d"],
        },
      ],
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to start translation job");
  return response.json();
}
