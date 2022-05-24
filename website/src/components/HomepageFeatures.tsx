import { useColorMode } from "@docusaurus/theme-common";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/system";
import React from "react";
import { FeatureCard } from "./FeatureCard";
import { FeatureList } from "./FeatureList";

const StyledHeader = styled("div")<{ dark: number }>(({ theme, dark }) => ({
  backgroundColor: dark ? theme.palette.footer.background : theme.palette.white,
  width: "100vw",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "-50px 0px 55px",
  paddingLeft: "40px",
}));

const StyledHeaderTitle = styled(Typography)<{ dark: number }>(
  ({ dark, theme }) => ({
    marginBottom: "12px",
    fontWeight: 600,
    fontFamily: "Poppins",
    color: dark ? theme.palette.white : "#171725",
    fontSize: 25,
    letterSpacing: "0.12px",
  })
);


export function HomepageFeatures(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    defaultMatches: true,
  });
  const { colorMode } = useColorMode();

  return (
    <>
      <StyledHeader dark={colorMode === "dark" ? 1 : 0}>
        <div style={{ maxWidth: "1024px", margin: "auto" }}>
          <StyledHeaderTitle dark={colorMode === "dark" ? 1 : 0}>
            Welcome to Switchboard Documentation
          </StyledHeaderTitle>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins",
              color: "#92929d",
              fontSize: 16,
              lineHeight: 1.43,
            }}
          >
            Switchboard provides a permission-less data layer to bridge the gap
            between the internet and web3. Click on a card below to learn how
            you can build with us.
          </Typography>
        </div>
      </StyledHeader>
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1024,
          alignSelf: "center",
        }}
      >
        {FeatureList.map((props, idx) => (
          <Grid item key={props.title} xs={12} sm={6} md={4}>
            <FeatureCard {...props} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
