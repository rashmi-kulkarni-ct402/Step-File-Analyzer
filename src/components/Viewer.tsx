import React, { useState, useMemo } from "react";
import { Grid, AppBar, Toolbar, Button } from "@mui/material";
import { savePropertiesToExcel } from "../utils/excelUtils";
import useAccessToken from "../hooks/useAccessToken";
import useFileHandling from "../hooks/useFileHandling";
import useForgeViewer from "../hooks/useForgeViewer";
import useObjectProperties from "../hooks/useObjectProperties";

declare global {
  interface Window {
    Autodesk: any;
  }
}

const Viewer: React.FC = () => {
  var Autodesk = window.Autodesk;
  const [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);
  const [selectedDbId, setSelectedDbId] = useState<number | null>(null);

  // hooks call
  const token = useAccessToken();
  const accessTokenString = useMemo(() => token?.access_token ?? null, [token]);
  const { urn, fileInputRef, handleButtonClick, handleFileChange } =
    useFileHandling(accessTokenString);
  useForgeViewer(urn, accessTokenString);
  const properties = useObjectProperties(accessTokenString, urn);

  return (
    <Grid container style={{ height: "100vh", width: "100%" }}>
      <Grid
        item
        xs={7.9}
        style={{
          height: "100%",
          width: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          id="forgeViewer"
          style={{
            background: "lightgrey",
            height: "100vh",
            width: "100%",
            position: "relative",
          }}
        />
      </Grid>
      <Grid item xs={0.1}>
        <div style={{ background: "white" }}></div>
      </Grid>
      <Grid
        item
        xs={4}
        style={{
          background: "aliceblue",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100px",
          }}
        >
          <h2>File Properties</h2>
        </div>
      </Grid>
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
            onClick={() => savePropertiesToExcel(properties)}
          >
            Save File Properties
          </Button>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Viewer;
