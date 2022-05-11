// Set MUI Theme
import { createTheme } from "@mui/material/styles";
import Palette from "./palette";

// create theme and apply defaults
export const theme = createTheme({
  typography: {
    // apply fonts here
    fontFamily: ["Source Sans Pro", "Poppins"].join(","),
    fontPrimary: "Source Sans Pro",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        autoComplete: "off",
      },
    },
    MuiFilledInput: {
      defaultProps: {
        autoComplete: "off",
      },
    },
  },
  palette: Palette,
});
