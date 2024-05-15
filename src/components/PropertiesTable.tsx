/*
 * PropertiesTable Component
 * This component displays a sortable table of properties extracted from STEP files.
 */

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { PropertiesDataCollection } from "../model/types/forgeAPIResponse.types";

interface PropertiesTableProps {
  propertiesCollection: PropertiesDataCollection[];
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  propertiesCollection,
}) => {
  // Sort properties by object ID and filter out any that are named 'none'
  const sortedProperties = propertiesCollection
    .sort((a, b) => a.objectid - b.objectid)
    .filter((item) => item.name.toLowerCase() !== "none"); // Filtering out items with 'none' or 'None' in Name

  // Recursive function to render properties which may be nested
  const renderProperties = (properties: {
    [key: string]: any;
  }): JSX.Element => {
    if (!properties) return <div>This Step File has no Properties</div>;
    return (
      <>
        {Object.entries(properties)
          .sort()
          .map(([key, value], index) => {
            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              return (
                <div key={index}>
                  {`${key}: `}
                  {renderProperties(value)}
                </div>
              ); // Recursive call for nested objects
            }
            return <div key={index}>{`${key}: ${value}`}</div>;
          })}
      </>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10%" }}>Object ID</TableCell>
            <TableCell sx={{ width: "20%" }}>Name</TableCell>
            <TableCell sx={{ width: "70%" }}>Properties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProperties.map((item) => (
            <TableRow key={item.objectid}>
              <TableCell sx={{ width: "10%", verticalAlign: "top" }}>
                {item.objectid}
              </TableCell>
              <TableCell sx={{ width: "20%", verticalAlign: "top" }}>
                {item.name}
              </TableCell>
              <TableCell sx={{ width: "70%", verticalAlign: "top" }}>
                {renderProperties(item.properties)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
