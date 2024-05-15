/*
 * API Call to Fetch Access Token from Autodesk Authentication API
 * This function retrieves an access token required for making authenticated requests to the Autodesk API.
 */
import { ForgeViewerToken } from "../model/types/forgeViewer.types";
import { forgeConfig } from "../utils/forgeConfig.utils";

export async function getAccessToken(): Promise<ForgeViewerToken> {
  const url = "https://developer.api.autodesk.com/authentication/v2/token";
  const credentials = btoa(
    `${forgeConfig.clientId}:${forgeConfig.clientSecret}`
  );
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Authorization: `Basic ${credentials}`,
  };

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: forgeConfig.scope,
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
