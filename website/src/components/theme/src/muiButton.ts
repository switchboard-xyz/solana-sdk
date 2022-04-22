import { ButtonClasses, IconButtonClasses } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { theme } from "./theme";

export const MuiIconButton: Partial<
  OverridesStyleRules<keyof IconButtonClasses>
> = {
  root: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
};

export const MuiButton: Partial<OverridesStyleRules<keyof ButtonClasses>> = {
  root: {
    backgroundColor: theme.palette.white,
    height: 52,
    borderRadius: 26,
    fontFamily: "Source Sans Pro",
    fontSize: 16,
    fontWeight: 600,
    fontStretch: "normal",
    fontStyle: "normal",
    whiteSpace: "nowrap",
    lineHeight: "normal",
    letterSpacing: 0.51,
    color: theme.palette.black,
    "&.Mui-disabled": {
      color: theme.palette.white[1],
    },
  },
  contained: {
    color: theme.palette.white,
    textTransform: "none",
    padding: "0px 72px",
    backgroundColor: theme.palette.blue,
    boxShadow: `0 11px 15px 0 rgba(164, 164, 164, 0.21)`,
    [theme.breakpoints.down("sm")]: {
      padding: "0px 56px",
    },
    "&:hover": {
      boxShadow: `0 11px 15px 0 rgba(164, 164, 164, 0.21)`,
      backgroundColor: theme.palette.footer.background,
    },
    "@media (hover: none)": {
      "&:hover": {
        boxShadow: `0 11px 15px 0 rgba(164, 164, 164, 0.21) !important`,
        backgroundColor: `${theme.palette.footer.background} !important`,
      },
    },
  },
  containedSecondary: {
    color: theme.palette.blue,
    backgroundColor: theme.palette.white,
    "&:hover": {
      color: theme.palette.white,
      backgroundColor: theme.palette.footer.background,
    },
    "@media (hover: none)": {
      "&:hover": {
        color: `${theme.palette.white} !important`,
        backgroundColor: `${theme.palette.footer.background} !important`,
      },
    },
  },
  text: {
    backgroundColor: theme.palette.transparent,
    color: theme.palette.blue,
    borderRadius: 12,
    "&:hover": {
      backgroundColor: theme.palette.transparent,
      color: theme.palette.cyan,
    },
    "& .MuiTouchRipple-root span": {
      backgroundColor: "rgba(0, 0, 0, 0.08)!important",
    },
  },
};
