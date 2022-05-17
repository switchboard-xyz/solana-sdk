/**
 * File for app colors
 */

const colors = {
  black: "#000000",
  blue: "#4c6fff",
  white: "#ffffff",
  indigo: "#635bff",
  pink: "#D372FC",
  yellow: "#fab007",
  orange: "#ff7602",
  cyan: "#12bcf5",
  transparent: "rgba(0,0,0,0)",
  red: "#fc5a5a",
  lightGray: "#f3f4f7",
};

const Palette = {
  black: colors.black,
  blue: colors.blue,
  white: colors.white,
  indigo: colors.indigo,
  yellow: colors.yellow,
  orange: colors.orange,
  cyan: colors.cyan,
  pink: colors.pink,
  red: colors.red,
  lightGray: colors.lightGray,
  transparent: colors.transparent,
  footer: {
    background: "#0a2540",
    text: "#8998AA",
  },
  pageText: {
    title: "#0a2540",
    body: "#425466",
    bodySecondary: "#6B7C93",
    highlight: colors.blue,
  },
  pageBackground: {
    primary: colors.white,
    secondary: "#f7f9fc",
  },
  navbar: {
    marketplace: "#061024",
  },
  background: {},
  primary: {},
};
// examples of applying some initial colors
Palette.background = { default: Palette.white };
Palette.primary = { main: Palette.black };

export default Palette;
