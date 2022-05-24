export type FeatureItem = {
  title: string;
  image: string;
  description: string;
  linkTo: string;
};

export const FeatureList: FeatureItem[] = [
  {
    title: "Introduction",
    image: "/img/icons/info.png",
    description:
      "Learn about Switchboard and how it enables the community to dictate what data lives on-chain.",
    linkTo: "/introduction",
  },
  {
    title: "Architecture",
    image: "/img/icons/arc.png",
    description:
      "Learn about Switchboard Oracle Queues and how they allocate oracle resources on-chain.",

    linkTo: "/queue",
  },
  {
    title: "Oracle",
    image: "/img/icons/oracle.png",
    description:
      "Learn how to contribute to the network and process data feed updates.",
    linkTo: "/oracle",
  },
  {
    title: "Data Feeds",
    image: "/img/icons/sol.png",
    description: "Learn how Switchboard data feeds work.",

    linkTo: "/feed",
  },
  {
    title: "Develop",
    image: "/img/icons/developers.png",
    description: "Learn how to develop with Switchboard and use the APIs.",
    linkTo: "/developers",
  },
  {
    title: "Publish",
    image: "/img/icons/publish.svg",
    description: "Publish your own data feeds on-chain through Switchboard.",
    linkTo: "https://publish.switchboard.xyz/",
  },
];
