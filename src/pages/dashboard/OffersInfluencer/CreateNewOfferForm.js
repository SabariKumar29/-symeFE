import { Button, styled, TextField } from "@mui/material";
import React, { useState } from "react";

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: "1rem",
  width: "100%",
}));

const CreateNewOfferForm = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await props.handleCreateNewOffer(title, description, props.user.userId);
    props.handleClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <StyledTextField
        label="Title"
        variant="filled"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <StyledTextField
        label="Description"
        variant="filled"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <Button
          variant="contained"
          sx={{ margin: "2rem" }}
          onClick={props.handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ margin: "2rem" }}
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateNewOfferForm;
