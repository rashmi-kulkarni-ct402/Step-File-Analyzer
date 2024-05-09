import { ForgeViewerToken } from "../model/types/forgeViewer.types";

export async function getAccessToken(): Promise<ForgeViewerToken> {
  const url = "https://developer.api.autodesk.com/authentication/v2/token";
  const credentials = btoa(
    "Qto1Gud4iHkqWAv1kMsAL0GoTXA4v5F8AGRkAqrg9fk1DABL:WtZGLZayaHdNG95Avf9kAFuG1JO8jIZsq2tNGo7QGutx20GWYA9IDtaB0AKNEOwU"
  );
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Authorization: `Basic ${credentials}`,
  };

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "data:create data:read bucket:read bucket:create",
  }).toString();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = (await response.json()) as ForgeViewerToken;
    return data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return {} as ForgeViewerToken;
  }
}
