import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Playlists = ({list}) => {

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={list}
      sx={{ width: 300, margin: '1rem' }}
      renderInput={(params) => <TextField {...params} label="Playlists" />}
    />
  );
};
export default Playlists;