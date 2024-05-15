import { useEffect, useState } from "react";
import { getAccessToken } from "../api/accessTokenAPI";
import { createBucket } from "../api/bucketManagementAPI";
import { ForgeViewerToken } from "../model/types/forgeViewer.types";
import { STEP_FILES_BUCKET_KEY } from "../model/constants";

const useAccessToken = (): ForgeViewerToken | null => {
  const [token, setToken] = useState<ForgeViewerToken | null>(null);

  useEffect(() => {
    getAccessToken().then((tokenResponse: ForgeViewerToken) => {
      setToken(tokenResponse);
      createBucket(tokenResponse.access_token, STEP_FILES_BUCKET_KEY);
      console.log("token: ", tokenResponse?.access_token);
    });
  }, []);

  return token;
};

export default useAccessToken;
