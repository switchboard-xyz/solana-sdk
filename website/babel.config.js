const presets = [require.resolve("@docusaurus/core/lib/babel/preset")];

//mui.com/guides/minimizing-bundle-size/#option-2
const plugins = [
  [
    "babel-plugin-import",
    {
      libraryName: "@mui/material",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
    "core",
  ],
  [
    "babel-plugin-import",
    {
      libraryName: "@mui/icons-material",
      libraryDirectory: "",
      camel2DashComponentName: false,
    },
    "icons",
  ],
];

module.exports = {
  presets,
  plugins,
};
