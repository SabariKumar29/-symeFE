import { createTheme } from "@mui/material/styles";
// Comman theme config
// Please add your config if it's need
// default Theme
export const defaultTheme = createTheme({
  // For colors
  palette: {
    primary: {
      // main: "#8F3A98",
      main: "#8F3A98",
    },
    primary2: {
      main: "#8F3A98",
    },
    secondary: {
      main: "#F5DBF8",
    },
    light: {
      main: "#CFA4CF50",
    },
    light1: {
      main: "#f7f2fb",
    },
    light2: {
      // main: "#CFA4CF8",
      main: "#e7e0ec",
    },
    blueLight: {
      main: "#B0DCFF",
    },
    warning: {
      main: "#b3261e",
    },
    white: {
      main: "#ffffff",
    },
    gray: {
      main: "#79747e",
      secondary: "rgb(244, 243, 246)",
    },
    green: {
      main: "#d1ffd9",
    },
    black: {
      main: "#000000",
    },
  },
  // For Typography (input field)
  typography: {
    fontFamily: "Mulish",
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: "white",
      },
      width: "150px",
    },
  },
  //For braking point customaization
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// defualtTheme.theme.typography.h3 = {
//   fontSize: "1.2rem",
//   "@media (min-width:600px)": {
//     fontSize: "1.5rem",
//   },
//   [defualtTheme.breakpoints.up("md")]: {
//     fontSize: "2.4rem",
//   },
// };

export const lightTheme = createTheme({
  // For colors
  palette: {
    primary: {
      main: "#E7E0EC",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  // For Typography (input field)
  typography: {
    fontFamily: "Mulish",
  },
});
export const darkTheme = createTheme({
  // For colors
  palette: {
    primary: {
      main: "#000000",
      light: "CFA4CF",
    },
    secondary: {
      // main: "#CFA4CF",
      main: "#000000",
    },
  },
  // For Typography (input field)
  typography: {
    fontFamily: "Mulish",
  },
});
