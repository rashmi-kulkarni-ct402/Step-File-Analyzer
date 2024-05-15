/*
 * Viewer Component
 * This component serves as the main interface for displaying and interacting with STEP file properties.
 * It integrates a 3D viewer setup, file handling mechanisms, and displays a properties table.
 * Users can load new STEP files to analyze, and save detailed properties to Excel.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Grid, AppBar, Toolbar, Button } from "@mui/material";
import { savePropertiesToExcel } from "../utils/excel.utils";
import useAccessToken from "../hooks/useAccessToken";
import useFileHandling from "../hooks/useFileHandling";
import useForgeViewer from "../hooks/useForgeViewer";
import useObjectProperties from "../hooks/useObjectProperties";
import { PropertiesTable } from "./PropertiesTable";
import { useLocation } from "react-router-dom";

const Viewer: React.FC = () => {
  const token = useAccessToken();
  const accessTokenString = useMemo(() => token?.access_token ?? null, [token]);
  const { urn, fileInputRef, handleButtonClick, handleFileChange } =
    useFileHandling(accessTokenString);
  useForgeViewer(urn, accessTokenString);
  const properties = useObjectProperties(accessTokenString, urn);

  //  *****************************************************
  const location = useLocation();

  // Check if the 'location' object and 'state' property exist
  if (location && location.state) {
    // Destructure the 'file' property from the 'state' object
    const { file } = location.state;

    if (file) {
      handleFileChange(file);
    }
  }
  //  *****************************************************

  return (
    <Grid container style={{ height: "80vh", width: "100%" }}>
      <Grid
        item
        xs={6.9}
        style={{
          height: "80vh",
          width: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          id="forgeViewer"
          style={{
            background: "lightgrey",
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        />
      </Grid>
      <Grid item xs={0.1}>
        <div style={{ background: "white" }}></div>
      </Grid>
      <Grid item xs={5} style={{ height: "80vh" }}>
        <div
          style={{
            display: "flow",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            overflowY: "scroll",
            overflowX: "auto",
            background: "aliceblue",
          }}
        >
          <h2>File Properties</h2>
          {properties && (
            <PropertiesTable
              propertiesCollection={properties.collection || []}
            />
          )}
        </div>
      </Grid>
      <AppBar
        position="sticky"
        sx={{ top: "auto", bottom: 0, height: "10vh", width: "100%" }}
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
            onClick={() => savePropertiesToExcel(properties?.collection || [])}
          >
            Save File Properties
          </Button>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Viewer;
