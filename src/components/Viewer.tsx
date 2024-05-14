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
import { getMetadata } from "../api/accessMetadataAPI";
import { getProperties } from "../api/accessPropertiesAPI";
import { savePropertiesToExcel } from "../utils/excelUtils";

declare global {
  interface Window {
    Autodesk: any;
  }
}

const Viewer: React.FC = () => {
  var Autodesk = window.Autodesk;
  const [token, setToken] = useState<ForgeViewerToken>();
  const [urn, setUrn] = useState<string>();
  const [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);
  const [selectedDbId, setSelectedDbId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSelectionChanged = (event: any) => {
      const dbIds = forgeViewer?.getSelection();
      if (dbIds && dbIds.length > 0) {
        const dbId = dbIds[0];
        setSelectedDbId(dbId);
        console.log("Selected dbId:", dbId);
      }
    };

    if (forgeViewer) {
      forgeViewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        handleSelectionChanged
      );
      return () => {
        forgeViewer.removeEventListener(
          Autodesk.Viewing.SELECTION_CHANGED_EVENT,
          handleSelectionChanged
        );
      };
    }
  }, [forgeViewer]);

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
  }, [forgeViewer, urn]);

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

  useEffect(() => {
    getAccessToken().then((token: ForgeViewerToken) => {
      setToken(token);
      createBucket(token.access_token, STEP_FILES_BUCKET_KEY);
    });
  }, []);

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
    console.log("urn: ", urn);
    console.log("token: ", token);
  };

  function onDocumentLoadFailure() {
    console.error("Failed fetching Forge manifest");
  }

  const fetchObjectProperties = async (dbId: number) => {
    if (!token || !urn) {
      console.log("Token or URN not available.");
      return;
    }

    try {
      const metadata = await getMetadata(token.access_token, urn);
      if (!metadata || !metadata.data || !metadata.data.metadata) {
        console.error("Metadata not available.");
        return;
      }

      const guid = metadata.data.metadata[0].guid;
      const properties = await getProperties(token.access_token, urn, guid);
      if (!properties || !properties.data) {
        console.error("Properties not available.");
        return;
      }
      console.log("guid: ", guid);
      console.log("Object properties:", properties.data);
      savePropertiesToExcel(properties.data);
    } catch (error) {
      console.error("Error fetching or saving object properties:", error);
    }
  };

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
      <Grid
        item
        xs={4}
        style={{ height: "100%", background: "lightgray" }}
      ></Grid>
      <AppBar
        position="sticky"
        sx={{ top: "auto", bottom: 0, width: "100%" }}
        style={{ backgroundColor: "darkblue" }}
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
          <Button
            variant="contained"
            color="success"
            onClick={() => selectedDbId && fetchObjectProperties(selectedDbId)}
          >
            Save File Properties
          </Button>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Viewer;
