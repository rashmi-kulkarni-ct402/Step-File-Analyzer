// Custom hook to fetch and manage properties of a 3D model.

import { useEffect, useState } from "react";
import { getMetadata } from "../api/accessMetadataAPI";
import { getProperties } from "../api/accessPropertiesAPI";
import { PropertiesData } from "../model/types/forgeAPIResponse.types";

export type ObjectPropertiesResponse = {
  fetchObjectProperties: () => void;
  properties: PropertiesData | undefined;
};

const useObjectProperties = (
  token: string | null,
  urn: string | undefined
): PropertiesData | undefined => {
  const [properties, setProperties] = useState<PropertiesData>();

  useEffect(() => {
    if (!token || !urn) {
      console.error("Token or URN not available.");
      return;
    }

    try {
      // Fetch metadata and then properties based on the metadata
      getMetadata(token, urn).then(async (metadata) => {
        // Fetch properties using the GUID
        if (!metadata || !metadata.data || !metadata.data.metadata) {
          console.error("Metadata not available.");
          return;
        }

        // Extract GUID from metadata
        const guid = metadata.data.metadata[0].guid;
        const getPropertiesResp = await getProperties(token, urn, guid);
        if (!getPropertiesResp) {
          console.error("getPropertiesResp not available.");
          return;
        }
        console.log("guid: ", guid);
        console.log("Object getPropertiesResp:", getPropertiesResp);
        // Set the fetched properties in state
        setProperties(getPropertiesResp);
      });
    } catch (error) {
      console.error("Error fetching or saving object properties:", error);
    }
  }, [token, urn]); // Dependencies

  return properties;
};

export default useObjectProperties;
