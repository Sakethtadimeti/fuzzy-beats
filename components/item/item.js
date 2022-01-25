import React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Draggable } from "react-beautiful-dnd";
// import './item.scss.js';

const getThumbnail = (thumbnails) => {
  if (thumbnails.default) {
    return thumbnails.default;
  } else if (thumbnails.standard) {
    return thumbnails.standard;
  }
  return { url: "", height: 50, width: 50 };
};
const Item = ({ item, index }) => {
  const { snippet } = item;
  const { title, description, thumbnails, videoOwnerChannelTitle, resourceId } =
    snippet;
  const handleAddtoPlaylistClick = async () => {
    const response = await gapi.client.youtube.playlistItems.insert({
      part: ["snippet"],
      resource: {
        snippet: {
          playlistId:
            "PL10AcZseO212197NypOHbqnJFFWS6G7BI" || snippet.playlistId,
          position: 0,
          resourceId,
        },
      },
    });
    console.log(response);
  };
  const thumbnail = getThumbnail(thumbnails);
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div>
          <Box
            mt={1}
            mb={1}
            mr={1}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Paper elevation={3}>
              <Card
                variant="outlined"
                className="item"
                sx={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
                onClick={handleAddtoPlaylistClick}
              >
                <Image
                  src={thumbnail?.url}
                  alt={description}
                  height={75 || thumbnail?.height}
                  width={75 || thumbnail?.width}
                />
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {title}
                </Typography>
              </Card>
            </Paper>
          </Box>
        </div>
      )}
    </Draggable>
  );
};

export default Item;
