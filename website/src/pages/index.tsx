import { useColorMode } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Box, CssBaseline } from "@mui/material";
import { styled, ThemeProvider } from "@mui/system";
import Layout from "@theme/Layout";
import React from "react";
/* eslint-disable import/extensions */
import { HomepageFeatures } from "../components/HomepageFeatures";
import theme from "../components/theme";

const StyledMain = styled("main")<{ dark: number }>(({ theme, dark }) => ({
  backgroundColor: dark ? "#1f354b" : theme.palette.pageBackground.secondary,
  padding: "50px 32px 90px",
  minHeight: "calc(100vh - 324px)", // 100vh - footer/padding
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.down(966)]: {
    padding: "50px 32px 90px",
  },
}));

const Main = () => {
  const { colorMode } = useColorMode();

  return (
    <StyledMain dark={colorMode === "dark" ? 1 : 0}>
      <HomepageFeatures />
      <Box sx={{ height: 20 }} />
    </StyledMain>
  );
};

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Layout
          title="Documentation"
          description="Documentation for Switchboard V2"
        >
          <Main />
        </Layout>
      </CssBaseline>
    </ThemeProvider>
  );
}
