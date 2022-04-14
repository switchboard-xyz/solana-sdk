import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { Card, Typography, CardContent, Divider } from "@mui/material";
import { styled } from "@mui/system";
import { FeatureItem } from "./FeatureList";
import useThemeContext from "@theme/hooks/useThemeContext";

const StyledCard = styled(Card)<{ dark: number }>(({ theme, dark }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  textAlign: "left",
  backgroundColor: dark ? theme.palette.footer.background : theme.palette.white,
  position: "relative",
  borderRadius: "13.2px",
  boxShadow: `0 6px 7px 5px rgba(${dark ? "107 107 107" : "86, 86, 86"}, 0.03)`,
  [theme.breakpoints.down(300)]: {
    paddingLeft: "",
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  whiteSpace: "nowrap",
  fontSize: 22,
  marginLeft: "22px",
  fontWeight: 600,
  letterSpacing: "0.16px",

  [theme.breakpoints.down(300)]: {
    marginLeft: "10px",
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: 18.5,
  margin: "20px 0px 0px",
  height: "110px",
  lineHeight: 1.29,
  letterSpacing: "0.44px",
  [theme.breakpoints.down(400)]: {
    fontSize: "17px",
  },
  [theme.breakpoints.down(300)]: {
    fontSize: 13,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "21px",
  [theme.breakpoints.down(300)]: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

export default function FeatureCard({
  title,
  image,
  description,
  linkTo,
}: FeatureItem) {
  const { isDarkTheme } = useThemeContext();

  return (
    <StyledCard dark={isDarkTheme ? 1 : 0}>
      <StyledCardContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              backgroundColor: "#4c6fff",
              borderRadius: "8px",
              height: 48,
              width: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={useBaseUrl(image)}
              alt="feature card"
              height={26}
              width={26}
            />
          </div>
          <StyledTitle sx={{ color: isDarkTheme ? "#dbdbdb" : "#0b3863" }}>
            {title}
          </StyledTitle>
        </div>
        <StyledDescription
          variant="body2"
          sx={{ color: isDarkTheme ? "#dbdbdb" : "#313e79" }}
        >
          {description}
        </StyledDescription>
        <div
          style={{
            width: "100%",
            height: "31px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Divider
            sx={{
              margin: "0px -21px 15px",
              borderColor: isDarkTheme ? "gray" : "Active Border",
            }}
          />
          <Link
            to={linkTo}
            style={{
              fontWeight: "bold",
              alignSelf: "flex-end",
              fontSize: 14,
              marginRight: "21px",
            }}
          >
            View More
          </Link>
        </div>
      </StyledCardContent>
    </StyledCard>
  );
}
