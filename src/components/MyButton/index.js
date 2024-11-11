import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MyButton = (props) => {
  if (props.type === "backButton") {
    return (
      <IconButton onClick={props.onClick}>
        <ArrowBackIcon />
      </IconButton>
    );
  } else {
    return (
      <Button
        {...props}
        onClick={props.onClick}
        color={props.color || "primary"}
        variant={props.variant || "contained"}
        size={props.size || "large"}
        startIcon={props?.startIcon || ""}
        endIcon={props?.endIcon || ""}
        sx={{
          ...props?.sx,
          cursor: !props?.onClick
            ? props?.cursor
              ? props?.cursor || null
              : "default"
            : null,
          textTransform: "capitalize",
          // padding: "5px",
          minWidth: "10px",
          whiteSpace: "nowrap",
          textWrap: "nowrap",
          width: props?.sx?.width || "fitContent",
          padding: props?.sx?.padding || "none",
          // boxShadow: "none"
        }}
        buttonFocusVisible="true"
        className={props?.className}
      >
        {props.children}
      </Button>
    );
  }
};
export default MyButton;
