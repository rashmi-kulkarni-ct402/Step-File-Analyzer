/*
 * FileAnalyser Component
 * This component serves as the main interface for displaying and interacting with STEP file properties.
 * It integrates a 3D viewer setup, file handling mechanisms, and displays a properties table.
 * Users can load new STEP files to analyze, and save detailed properties to Excel.
 */

import React, { useMemo } from "react";
import { Grid, AppBar, Toolbar, Button } from "@mui/material";
import { savePropertiesToExcel } from "../utils/excel.utils";
import useAccessToken from "../hooks/useAccessToken";
import useFileHandling from "../hooks/useFileHandling";
import useObjectProperties from "../hooks/useObjectProperties";
import { PropertiesTable } from "./PropertiesTable";
import Viewer from "./Viewer";

const FileAnalyser: React.FC = () => {
  // Hook to retrieve the access token required for Autodesk Forge API
  const token = useAccessToken();
  // Memoized access token string to avoid unnecessary recalculations
  const accessTokenString = useMemo(() => token?.access_token ?? null, [token]);
  // Custom hook to handle file uploading, obtaining the URN, and managing the file input reference
  const { urn, fileInputRef, handleButtonClick, handleFileChange } =
    useFileHandling(accessTokenString);
  // Custom hook to fetch properties of the STEP file based on the URN
  const properties = useObjectProperties(accessTokenString, urn);

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
        <Viewer urn={urn} token={accessTokenString} />
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

export default FileAnalyser;
