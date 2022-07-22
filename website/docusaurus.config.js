// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const math = require("remark-math");
const katex = require("rehype-katex");

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
          remarkPlugins: [math],
          rehypePlugins: [katex],
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
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
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
        sidebarPath: require.resolve("./sidebarsIDL.js"),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "XO84KDTPTB",
        apiKey: "bc1bca7d93098a0d241c000cd8e900aa",
        indexName: "switchboard",
      },
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
          {
            type: "search",
            position: "right",
          },
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Docs",
          },
          {
            to: "/idl/",
            position: "left",
            label: "IDL",
            // activeBaseRegex: "docs/(next|v8)",
          },
          {
            type: "dropdown",
            label: "APIs",
            position: "left",
            to: "/api/",
            items: [
              {
                label: "Task Protobufs",
                to: "/api/tasks",
              },
              {
                label: "Typescript",
                to: "https://docs.switchboard.xyz/api/ts",
              },
              {
                label: "Typescript Lite",
                to: "https://docs.switchboard.xyz/api/ts-lite",
              },
              {
                label: "Sbv2 Utils",
                to: "https://docs.switchboard.xyz/api/sbv2-utils",
              },
              {
                label: "Python",
                to: "https://docs.switchboard.xyz/api/py",
              },
              {
                label: "Rust",
                to: "https://docs.rs/switchboard-v2/latest/switchboard_v2/",
              },
              {
                label: "CLI",
                to: "/api/cli",
              },
            ],
          },
          {
            to: "https://publish.switchboard.xyz/",
            label: "Publisher",
            position: "right",
          },
          {
            to: "https://switchboardxyz.medium.com/",
            label: "Blog",
            position: "right",
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
                href: "https://docs.rs/switchboard-v2/latest/switchboard_v2/",
              },
              {
                label: "Client API Docs",
                href: "https://docs.switchboard.xyz/api/ts",
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
