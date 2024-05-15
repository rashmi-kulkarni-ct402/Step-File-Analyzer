// Custom  hook to fetch and store an access token necessary for authenticated API calls.

import { useEffect, useState } from "react";
import { getAccessToken } from "../api/accessTokenAPI";
import { createBucket } from "../api/bucketManagementAPI";
import { ForgeViewerToken } from "../model/types/forgeViewer.types";
import { STEP_FILES_BUCKET_KEY } from "../model/constants/index.constants";

const useAccessToken = (): ForgeViewerToken | null => {
  const [token, setToken] = useState<ForgeViewerToken | null>(null);

  useEffect(() => {
    // Fetch the access token when the component mounts
    getAccessToken().then((tokenResponse: ForgeViewerToken) => {
      // Set the fetched token into state
      setToken(tokenResponse);
      // Create a bucket with the new token
      createBucket(tokenResponse.access_token, STEP_FILES_BUCKET_KEY);
      // Log the token for debugging
      console.log("token: ", tokenResponse?.access_token);
    });
  }, []); // Empty dependency array

  return token;
};

export default useAccessToken;
