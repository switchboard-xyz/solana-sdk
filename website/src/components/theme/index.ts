import { MuiButton, MuiIconButton } from "./src/muiButton";
import { MuiTypography } from "./src/muiTypography";
import Palette from "./src/palette";
import { theme } from "./src/theme";

// Apply the overrides
theme.components = {
  MuiTypography: { styleOverrides: MuiTypography },
  MuiButton: { styleOverrides: MuiButton },
  MuiIconButton: { styleOverrides: MuiIconButton },
};

export { theme, Palette };
export default theme;
