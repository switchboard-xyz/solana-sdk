import "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    white: string;
    black: string;
    indigo: string;
    yellow: string;
    orange: string;
    blue: string;
    cyan: string;
    pink: string;
    red: string;
    lightGray: string;
    transparent: string;

    pageText: {
      title: string;
      body: string;
      bodySecondary: string;
      highlight: string;
    };

    pageBackground: {
      primary: string;
      secondary: string;
    };

    footer: {
      background: string;
      text: string;
    };
    navbar: {
      marketplace: string;
    };
  }
}

declare module "@mui/material/styles/createTypography" {
  interface TypographyOptions {
    color?: string;
    fontPrimary?: string;
    fontSecondary?: string;
  }
}

declare module "@mui/material/styles/createTheme" {
  interface ThemeOptions {
    background?: string;
  }
}
