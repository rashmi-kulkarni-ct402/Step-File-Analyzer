/*
 * FlipCard Component
 * This component represents a flip card that toggles between a question and an answer upon click.
 */

import React, { useState } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

interface FlipCardProps {
  question: string;
  answer: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card
      onClick={() => setFlipped(!flipped)}
      sx={{
        width: "100%",
        height: 250,
        bgcolor: flipped ? "slateblue" : "royalblue",
        m: 2,
        transition: "background-color 0.5s ease",
      }}
    >
      <CardActionArea
        sx={{
          position: "relative",
          width: "120%",
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            position: "sticky",
            width: "75%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "white",
              overflowWrap: "break-word",
            }}
          >
            {!flipped ? question : answer}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FlipCard;
