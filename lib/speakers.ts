export type Speaker = {
  name: string;
  role: string;
  background: string;
  /** ISO date-time of the talk, if scheduled. */
  date?: string;
  year: string;
};

/**
 * Past and upcoming club speakers. Mirrors the data behind the live
 * stanfordai.club speakers view; grouped by academic year at render time.
 */
export const SPEAKERS: Speaker[] = [
  {
    name: "Andrew Milich & Philip Clark",
    role: "Cursor, Thrive Capital",
    background:
      "Head of Engineering/Product at Cursor; Partner at Thrive Capital.",
    date: "2026-01-26T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Audrey Wisch, Drew Bent, Rob Reich",
    role: "Anthropic, Curious Cardinals, Stanford",
    background: "Panel on AI ethics, education, and industry perspectives.",
    date: "2026-01-22T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Chamath Palihapitiya",
    role: "Founder, Social Capital & 8090; All-In Podcast",
    background:
      "Investor and entrepreneur across consumer tech, climate, and public markets.",
    date: "2026-04-20T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Erik Bernhardsson",
    role: "Co-founder & CEO, Modal",
    background: "Building cloud infrastructure for AI and batch compute.",
    date: "2026-04-13T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Sangeen Zeb",
    role: "General Partner, Google Ventures",
    background: "Invests in early-stage technology companies at GV.",
    date: "2026-03-02T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Stephanie Chan",
    role: "Senior Research Scientist, Google DeepMind",
    background: "Research at the frontier of large-scale ML and AI systems.",
    date: "2026-02-19T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Cory Levy & Z Fellows",
    role: "Z Fellows",
    background:
      "Program supporting young founders building ambitious companies.",
    date: "2026-02-16T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Konstantine Buhler",
    role: "Partner, Sequoia Capital",
    background:
      "Invests in AI, enterprise, and frontier technology companies.",
    date: "2026-02-09T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Danny Driess",
    role: "Research Scientist, Physical Intelligence",
    background: "Leading researcher in embodied AI and robotics.",
    year: "2025-2026",
  },
  {
    name: "Parag Agrawal",
    role: "Founder & CEO, Parallel Web Systems",
    background: "Former CEO of Twitter",
    date: "2025-10-02T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Ishan Mukherjee",
    role: "CEO, Rox",
    background: "Founder of Rox, building the AI native CRM.",
    date: "2025-10-08T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Dan Fu",
    role: "Professor, UCSD",
    background:
      "Creator of FlashAttention and ThunderKittens, foundational systems ML GPU kernels.",
    date: "2025-10-13T17:00:00",
    year: "2025-2026",
  },
  {
    name: "Jason Wei",
    role: "Researcher, Meta Superintelligence Labs",
    background:
      "Co-developed Chain-of-Thought reasoning models at OpenAI - o1, o3.",
    date: "2025-10-16T18:00:00",
    year: "2025-2026",
  },
  {
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
    background: "Founder of Vercel and Next.js.",
    date: "2025-11-04T15:00:00",
    year: "2025-2026",
  },
  {
    name: "Jeff Dean",
    role: "Chief Scientist, Google",
    background: "Leads all research at Google, Google DeepMind, Waymo, etc.",
    date: "2025-11-18T17:00:00",
    year: "2025-2026",
  },
  {
    name: "Sam Altman",
    role: "CEO, OpenAI",
    background:
      "Co-founder of OpenAI and former President of Y Combinator.",
    year: "2024-2025",
  },
  {
    name: "François Chollet",
    role: "Founder, ARC Prize",
    background:
      "Creator of Keras at Google and author of 'Deep Learning with Python'.",
    year: "2024-2025",
  },
  {
    name: "Nicholas Carlini",
    role: "Research Scientist, Anthropic",
    background:
      "Specialist in AI safety, formerly at Google DeepMind and Google Brain.",
    year: "2024-2025",
  },
  {
    name: "Evan Hubinger",
    role: "Research Scientist, Anthropic",
    background:
      "Focuses on alignment and safety. Formerly at OpenAI and Google.",
    year: "2024-2025",
  },
  {
    name: "Will Bryk",
    role: "Founder & CEO, Exa",
    background: "Founded the world's top search engine for AI",
    year: "2024-2025",
  },
  {
    name: "Demi Guo",
    role: "Founder & CEO, Pika Labs",
    background:
      "Founded one of the top AI video generation model labs, Pika",
    year: "2024-2025",
  },
];
