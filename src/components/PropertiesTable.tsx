/*
 * PropertiesTable Component
 * This component displays a sortable table of properties extracted from STEP files.
 */

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { PropertiesDataCollection } from "../model/types/forgeAPIResponse.types";
import { objectContainsQuery } from "../utils/objectQuery.utils";

// Define the props for the PropertiesTable component
interface PropertiesTableProps {
  propertiesCollection: PropertiesDataCollection[];
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  propertiesCollection,
}) => {
  // State to manage the search query input, search option selected by the user
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("objectid");

  // Handler for changes in the search query input field
  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  // Handler for changes in the search option dropdown
  const handleSearchOptionChange = (event: SelectChangeEvent<string>) => {
    setSearchOption(event.target.value as string);
  };

  // Function to filter properties based on the search query and selected search option
  const filterProperties = (collection: PropertiesDataCollection[]) => {
    // Filter by Object ID
    if (searchOption === "objectid") {
      return collection.filter((item) =>
        item.objectid.toString().includes(searchQuery)
      );
    }
    // Filter by Name
    else if (searchOption === "name") {
      return collection.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Filter by Properties
    else if (searchOption === "properties") {
      return collection.filter((item) =>
        objectContainsQuery(item.properties, searchQuery)
      );
    }
    return collection; // Return the original collection if no filter is applied
  };

  // Filter the properties collection based on the search query and selected search option
  const filteredProperties = filterProperties(propertiesCollection)
    // Sort the filtered properties by Object ID in ascending order
    .sort((a, b) => a.objectid - b.objectid)
    // Filter out any items where the name is "none"
    .filter((item) => item.name.toLowerCase() !== "none");

  // Recursive function to render properties which may be nested objects
  const renderProperties = (properties: {
    [key: string]: any;
  }): JSX.Element => {
    // Display message if there are no properties
    if (!properties) return <div>This Step File has no Properties</div>;
    return (
      <>
        {Object.entries(properties)
          .sort() // Sort properties alphabetically by key
          .map(([key, value], index) => {
            // If the property value is an object (and not null or an array), render it recursively
            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              // Recursive call for nested objects
              return (
                <div key={index}>
                  {`${key}: `}
                  {renderProperties(value)}
                </div>
              );
            }
            // Otherwise, render the key-value pair
            return <div key={index}>{`${key}: ${value}`}</div>;
          })}
      </>
    );
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Search By</InputLabel>
        <Select
          value={searchOption}
          onChange={handleSearchOptionChange}
          label="Search By"
        >
          <MenuItem value="objectid">Object ID</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="properties">Properties</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        sx={{ m: 1 }}
      />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                Object ID
              </TableCell>
              <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ width: "10%", fontWeight: "bold" }}>
                Properties
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties.map((item) => (
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
    </>
  );
};
