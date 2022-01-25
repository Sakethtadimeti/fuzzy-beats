import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import Item from "components/item";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Search from "@mui/icons-material/Search";
import { getPlaylistVideos } from "utils/google";
import Typography from "@mui/material/Typography";
import { Droppable } from "react-beautiful-dnd";

/**
 *
 * TODO : add visual cues on drag using snapshot parameter
 *
 * @param {*} param0
 * @returns
 */
const ItemList = ({ playlist }) => {
  const { id: playlistId = "LL", title, videos } = playlist;

  return (
    <Box sx={{ width: "30rem", padding: "1rem" }}>
      <Box sx={{ display: "flex", alignItems: "center" }} mb={1}>
        <TextField id="input-with-sx" label="Search" variant="standard" />
        <Search mr={1} sx={{ marginRight: "0.5rem" }} />
        <Typography variant="h4">{title}</Typography>
      </Box>
      <Droppable droppableId={playlistId}>
        {(provided) => (
          <div>
            <Box
              sx={{
                maxHeight: "50rem",
                overflow: "scroll",
                paddingRight: "1rem",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {videos?.map((item, index) => (
                <Item key={item.id} item={item} index={index} />
                /* <Divider variant="inset" component="li" /> */
              ))}
              {provided.placeholder}
            </Box>
          </div>
        )}
      </Droppable>
    </Box>
  );
};

export default ItemList;
