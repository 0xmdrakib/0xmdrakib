export type ProjectCategory = "Agent Infrastructure" | "Onchain" | "AI";
export type ProjectStatus = "Flagship" | "Live" | "In development";

export interface Project {
  name: string;
  slug: string;
  category: ProjectCategory;
  status: ProjectStatus;
  index: string;
  tagline: string;
  description: string;
  value: string;
  repoUrl: string;
  liveUrl: string;
  stack: string[];
  capabilities: string[];
  featured: boolean;
  accent: "acid" | "coral" | "cyan";
  image: string;
}

export const projects: Project[] = [
  {
    name: "AgentDomain",
    slug: "agentdomain",
    category: "Agent Infrastructure",
    status: "Flagship",
    index: "01",
    tagline: "Identity infrastructure for the agentic internet.",
    description:
      "A complete identity stack that gives autonomous agents a domain, DNS, email, SSL, onchain names, an AgentID NFT, and renewal automation through one registration flow.",
    value:
      "AgentDomain replaces a fragmented, manual setup process with one programmable identity layer that agents can own and operate.",
    repoUrl: "https://github.com/0xmdrakib/AgentDomain",
    liveUrl: "https://agentdomain.app",
    stack: ["Next.js", "TypeScript", "Base", "ENS", "x402", "MCP"],
    capabilities: [
      "Domain + managed DNS",
      "Agent email + SSL",
      "Basename + ENS",
      "AgentID NFT",
      "SDK + MCP server",
      "Autonomous renewals",
    ],
    featured: true,
    accent: "acid",
    image: "/projects/agentdomain-social-card.png",
  },
  {
    name: "NexoraSwap",
    slug: "nexoraswap",
    category: "Onchain",
    status: "Live",
    index: "02",
    tagline: "Multi-router execution without the route hunting.",
    description:
      "A cross-chain DEX console that compares and executes routes across EVM networks and Solana through 1inch, LI.FI, and gas.zip.",
    value:
      "NexoraSwap makes complex swap routing legible by surfacing quotes, fees, balances, route choices, and minimum received before execution.",
    repoUrl: "https://github.com/0xmdrakib/NexoraSwap",
    liveUrl: "https://nexoraswap.online",
    stack: ["Next.js", "Wagmi", "viem", "LI.FI", "Solana", "1inch"],
    capabilities: [
      "Best-route comparison",
      "EVM + Solana",
      "Cross-chain execution",
      "Transparent fee detail",
    ],
    featured: false,
    accent: "cyan",
    image: "/projects/nexoraswap-icon.png",
  },
  {
    name: "AtlasAssistant",
    slug: "atlasassistant",
    category: "AI",
    status: "Live",
    index: "03",
    tagline: "A calmer interface for understanding the world.",
    description:
      "A high-signal global news workspace with focused feeds, useful filters, AI digests, article summaries, listening mode, and broad language support.",
    value:
      "AtlasAssistant turns a noisy news cycle into a structured reading flow built around context, signal, and time saved.",
    repoUrl: "https://github.com/0xmdrakib/AtlasAssistant",
    liveUrl: "https://atlasassistant.online",
    stack: ["Next.js", "TypeScript", "Prisma", "AI summaries", "RSS"],
    capabilities: [
      "Focused global feeds",
      "AI daily digest",
      "Article key points",
      "Listen + translate",
    ],
    featured: false,
    accent: "coral",
    image: "/projects/atlasassistant-icon.png",
  },
];

export const projectCategories = [
  "All",
  "Agent Infrastructure",
  "Onchain",
  "AI",
] as const;

export type ProjectFilter = (typeof projectCategories)[number];
