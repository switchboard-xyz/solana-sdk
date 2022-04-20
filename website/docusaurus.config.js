// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Switchboard",
  tagline: "Community curated lightspeed data feeds on-chain",
  url:
    process.env.NODE_ENV === "production"
      ? "https://docs.switchboard.xyz"
      : "http://localhost",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "switchboard-xyz", // Usually your GitHub org/user name.
  projectName: "switchboard-v2", // Usually your repo name.
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Automatically converts npm codeblocks to yarn
          remarkPlugins: [
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          // editUrl:
          //   process.env.NODE_ENV === "production"
          //     ? process.env.CI_PROJECT_URL + "/-/edit/main/"
          //     : "/",
        },
        pages: {
          remarkPlugins: [require("@docusaurus/remark-plugin-npm2yarn")],
        },
        theme: {
          customCss: [
            // require.resolve("./static/api/sbv2-api/assets/style.css"),
            // require.resolve("./static/api/sbv2-api/assets/highlight.css"),
            // require.resolve("./static/api/sbv2-api/assets/icons.css"),
            require.resolve("./src/css/custom.css"),
          ],
        },
      }),
    ],
  ],
  plugins: [
    "my-loaders",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "api",
        routeBasePath: "api",
        sidebarPath: require.resolve("./sidebarsAPI.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "idl",
        path: "idl",
        routeBasePath: "idl",
        sidebarPath: require.resolve("./sidebars.js"),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
        // switchConfig: {
        //   darkIcon: "🌜",
        //   lightIcon: "☀️",
        //   // React inline style object
        //   // see https://reactjs.org/docs/dom-elements.html#style
        //   darkIconStyle: {
        //     marginLeft: "2px",
        //   },
        //   lightIconStyle: {
        //     marginLeft: "1px",
        //   },
        // },
      },
      // Only for code blocks
      prism: {
        theme: require("prism-react-renderer/themes/nightOwl"),
        additionalLanguages: ["rust", "toml", "docker", "bash", "yaml"],
      },
      navbar: {
        title: "Switchboard Documentation",
        hideOnScroll: false,
        logo: {
          alt: "Switchboard Logo",
          src: "img/logo.svg",
          srcDark: "img/logo_white.svg",
        },
        items: [
          // Need to bring in Algolia DocSearch https://docsearch.algolia.com/
          // {
          //   type: "search",
          //   position: "right",
          // },
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Docs",
          },
          {
            to: "idl/",
            position: "left",
            label: "IDL",
            // activeBaseRegex: "docs/(next|v8)",
          },
          {
            type: "dropdown",
            // to: "api",
            label: "API",
            position: "left",
            to: "api",
            items: [
              {
                label: "Task Protobufs",
                to: "api/tasks",
              },
              {
                label: "Typescript",
                to: "https://docs.switchboard.xyz/api/sbv2-api",
              },
              {
                label: "Typescript Lite",
                to: "https://docs.switchboard.xyz/api/sbv2-lite",
              },
              {
                label: "Python",
                to: "https://docs.switchboard.xyz/api/sbv2-py",
              },
              {
                label: "Rust",
                to: "https://docs.rs/switchboard-v2/latest/switchboard_v2/",
              },
              {
                label: "CLI",
                to: "api/switchboardv2-cli",
              },
            ],
          },
          {
            to: "https://switchboard.xyz/explorer",
            label: "Feeds",
            position: "left",
          },
          {
            to: "https://switchboardxyz.medium.com/",
            label: "Blog",
            position: "left",
          },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://github.com/switchboard-xyz",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      i18n: {
        defaultLocale: "en",
        locales: ["en", "fr", "es"],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "DOCS",
            items: [
              {
                label: "Developer Resources",
                to: "/developers",
              },
              {
                label: "Rust API Docs",
                href: "https://docs.rs/switchboard-program/0.1.52/switchboard_program/",
              },
              {
                label: "Client API Docs",
                href: "https://switchboard-xyz.github.io/switchboard-api/",
              },
            ],
          },
          {
            title: "COMMUNITY",
            items: [
              {
                label: "Discord",
                href: "https://discord.com/invite/sNeGymrabT",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/switchboardxyz",
              },
              {
                label: "Telegram",
                href: "https://t.me/switchboardxyz",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/switchboardxyz",
              },
            ],
          },
          {
            title: "MORE",
            items: [
              {
                label: "Medium",
                href: "https://switchboardxyz.medium.com/",
              },
              {
                label: "Jobs",
                href: "https://app.trinethire.com/companies/35264-switchboard-technology-labs/jobs",
              },
              {
                label: "GitHub",
                href: "https://github.com/switchboard-xyz",
              },
            ],
          },
        ],
      },
    }),
};

module.exports = config;
