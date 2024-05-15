/*
 * API Call to Fetch Properties from Autodesk's Model Derivative API
 * This function retrieves the detailed properties of a specific model identified by the URN and model GUID.
 */

import {
  ModelPropertiesResponse,
  PropertiesData,
} from "../model/types/forgeAPIResponse.types";

export const getProperties = async (
  token: string,
  urn: string,
  modelGuid: string
): Promise<PropertiesData | null> => {
  const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ModelPropertiesResponse = await response.json();
    console.log("extract metadata properties ", data);
    return data.data;
  } catch (error) {
    console.error("extract Error fetching metadata:", error);
    return null;
  }
};
