/*
 * HomePage Component
 * This component serves as the main landing page of the application. It displays introductory cards using FlipCard components that provide
 * basic information about STEP files and their analysis.
 * It uses a drag-and-drop area for uploading files, which upon receiving a file, navigates to a viewer page with the file's details.
 */

import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useDropzone } from "react-dropzone";
import FlipCard from "./FlipCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFile(file);
      navigate("/viewer", { state: { file } });
    },
    [navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const cards = [
    {
      question: "What are STEP files?",
      answer:
        "A STEP file is a standardized format for exchanging product data between different CAD systems, ensuring compatibility and data integrity.",
    },
    {
      question: "Why are STEP files important?",
      answer:
        "STEP files are crucial for interoperability between CAD systems, enabling seamless collaboration, data exchange, and preserving design intent throughout the product lifecycle.",
    },
    {
      question: "What can I learn from analyzing a STEP file?",
      answer:
        "By analyzing a STEP file, you can see detailed information about the 3D model, such as its dimensions, structure, and components.",
    },
  ];

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#E3F2FD" }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            marginTop: "-100px",
            marginBottom: "50px",
          }}
        >
          <h2> Welcome to STEP file analyzer! </h2>
        </Typography>

        <Box
          display="flex"
          justifyContent="space-around"
          width="200%"
          sx={{ gap: 5, marginBottom: 10 }}
        >
          {cards.map((card, index) => (
            <FlipCard
              key={index}
              question={card.question}
              answer={card.answer}
            />
          ))}
        </Box>

        <Paper
          {...getRootProps()}
          sx={{
            width: "100%",
            p: 1,
            backgroundColor: "darkblue",
            marginTop: 1,
          }}
        >
          <input {...getInputProps()} />
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "white",
              fontStyle: "italic",
              fontSize: 20,
            }}
          >
            Drag and drop STEP file here...
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePage;
