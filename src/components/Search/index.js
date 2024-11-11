// SearchBar.js
import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ handlerFetchOffers, placeholder, query, setQuery }) => {
  return (
    <TextField
      // onKeyDown={}
      variant="outlined"
      fullWidth
      size="small"
      placeholder={placeholder}
      value={query || ""}
      onChange={(e) => {
        setQuery(e?.target?.value);
      }}
      onKeyDown={(e) => {
        if (e?.key === "Enter") {
          handlerFetchOffers(false, query);
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon onClick={() => handlerFetchOffers(false, query)} />
          </InputAdornment>
        ),
      }}
      sx={{
        maxWidth: "360px",
        borderRadius: "20px",
        backgroundColor: "#f3ebf9",
        "& .MuiOutlinedInput-root": {
          borderRadius: "20px",
          "& fieldset": {
            borderColor: "transparent",
          },
          "&:hover fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            borderColor: "transparent",
          },
          "& input": {
            padding: "10px 14px",
          },
        },
      }}
    />
  );
};

export default SearchBar;
