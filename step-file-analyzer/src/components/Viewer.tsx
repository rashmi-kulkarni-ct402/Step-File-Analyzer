import React, { useEffect, useState, useRef } from "react";
import { Grid, AppBar, Toolbar, Button } from "@mui/material";
import { ForgeViewerToken } from "../model/types/forgeViewer.types";
import { STEP_FILES_BUCKET_KEY } from "../model/constants";
import { getAccessToken } from "../api/accessTokenAPI";
import { createBucket } from "../api/bucketManagementAPI";
import { uploadFileToBucket } from "../api/fileManagementAPI";
import { checkFileUploaded } from "../api/fileManagementAPI";
import { translateFile } from "../api/translationManagementAPI";
import { createUrn } from "../utils/urnUtils";
import { checkJobStatus } from "../api/jobStatusAPI";

declare global {
  interface Window {
    Autodesk: any;
  }
}

const Viewer: React.FC = () => {
  var Autodesk = window.Autodesk;
  console.log("Autodesk: ", Autodesk);
  const [token, setToken] = useState<ForgeViewerToken>();
  const [urn, setUrn] = useState<string>();
  const [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);

  console.log("urn: ", urn);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (token) {
      const fileCheckResp = await checkFileUploaded(
        STEP_FILES_BUCKET_KEY,
        file.name,
        token.access_token
      );
      console.log("fileCheckResp: ", fileCheckResp);

      if (fileCheckResp) {
        setUrn(createUrn(STEP_FILES_BUCKET_KEY, file.name));
      } else {
        console.log("uploading file to bucket ... ");
        const uploadResp = await uploadFileToBucket(
          file,
          token.access_token,
          `stepfile_uploads`
        );
        console.log("uploadResp : ", uploadResp);
        const { objectId } = uploadResp;

        console.log("Sending uploaded file for translation ... ");
        const translationResp = await translateFile(
          objectId,
          token.access_token
        );
        console.log("translationResp : ", translationResp);
        const { urn } = translationResp;

        checkJobStatus(urn, token.access_token, (urn) => setUrn(urn));
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onDocumentLoadSuccess = (viewerDocument: Autodesk.Viewing.Document) => {
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    console.log("forgeViewer: ", forgeViewer);
    if (forgeViewer) {
      console.log("loading document node...");
      forgeViewer.loadDocumentNode(viewerDocument, defaultModel);

      forgeViewer?.toolbar?.setVisible(true);
    }

    console.log("Document loaded fine!", viewerDocument);
  };

  function onDocumentLoadFailure() {
    console.error("Failed fetching Forge manifest");
  }

  useEffect(() => {
    if (forgeViewer) {
      const startCode = forgeViewer.start();
      if (startCode === 0) {
        Autodesk.Viewing.Document.load(
          `urn:${urn}`,
          onDocumentLoadSuccess,
          onDocumentLoadFailure
        );
      } else {
        console.error("Failed to start the viewer.");
      }
    }
  }, [forgeViewer]);

  useEffect(() => {
    async function initializeViewer() {
      if (!urn || !token) {
        console.log("URN or token not available.");
        return;
      }

      console.log("Initializing viewer...");
      const options = {
        env: "AutodeskProduction2",
        api: "streamingV2",
        getAccessToken: (
          onTokenReady: (token: string, expires: number) => void
        ) => {
          onTokenReady(token.access_token, token.expires_in);
        },
      };

      Autodesk.Viewing.Initializer(options, function () {
        const viewerDiv = document.getElementById("forgeViewer");
        if (viewerDiv) {
          setForgeViewer(new Autodesk.Viewing.GuiViewer3D(viewerDiv));
        } else {
          console.error("Viewer element not found.");
        }
      });
    }

    initializeViewer();
  }, [urn, token]);

  console.log("token: ", token);
  useEffect(() => {
    getAccessToken().then((token: ForgeViewerToken) => {
      setToken(token);
      createBucket(token.access_token, STEP_FILES_BUCKET_KEY);
    });
  }, []);

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={7.9} style={{ height: "100%" }}>
        <div
          id="forgeViewer"
          style={{ width: "100%", height: "100%", background: "lightgray" }}
        />
      </Grid>
      <Grid item xs={0.1}>
        <div style={{ background: "white" }}></div>
      </Grid>
      <Grid item xs={4} style={{ height: "100%", background: "lightgray" }}>
        {/* space for file properties */}
      </Grid>
      <AppBar
        position="sticky"
        color="primary"
        sx={{ top: "auto", bottom: 0, width: "100%" }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            color="warning"
            sx={{ mr: 2 }}
            onClick={handleButtonClick}
          >
            Load STEP File
          </Button>
          <Button variant="contained" color="success">
            Save File Properties
          </Button>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Viewer;
