import { useColorMode } from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Box } from "@mui/material";
import React from "react";

interface MarkdownImageProps {
  img: string;
  lightBg?: string;
  darkBg?: string;
  sx?: any;
}

const MarkdownImage = (props: MarkdownImageProps) => {
  const { colorMode } = useColorMode();

  let backgroundColor = "inherit";
  if (props.lightBg && colorMode !== "dark") {
    backgroundColor = props.lightBg;
  }
  if (props.darkBg && colorMode === "dark") {
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
