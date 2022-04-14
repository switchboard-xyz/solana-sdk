import React from "react";
import { Box } from "@mui/material";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useThemeContext from "@theme/hooks/useThemeContext";

interface MarkdownImageProps {
  img: string;
  lightBg?: string;
  darkBg?: string;
  sx?: any;
}

const MarkdownImage = (props: MarkdownImageProps) => {
  const { isDarkTheme } = useThemeContext();

  let backgroundColor = "inherit";
  if (props.lightBg && !isDarkTheme) {
    backgroundColor = props.lightBg;
  }
  if (props.darkBg && isDarkTheme) {
    backgroundColor = props.darkBg;
  }

  let sx: any = {};
  if (props.sx) {
    sx = {
      backgroundColor,
      m: "auto",
      display: "flex",
      ...sx,
      ...props.sx,
    };
  }

  return <Box component="img" sx={sx} src={useBaseUrl(props.img)} />;
};

export default MarkdownImage;
