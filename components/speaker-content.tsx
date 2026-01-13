import { motion } from "framer-motion";
import { CalendarIcon } from "@radix-ui/react-icons";

type Speaker = {
  name: string;
  role: string;
  background: string;
  year: string;
  date?: Date;
};

const allSpeakers: Speaker[] = [
  {
    name: "Andrew Milich & Philip Clark",
    role: "Cursor, Thrive Capital",
    background: "Head of Engineering/Product at Cursor; Partner at Thrive Capital.",
    date: new Date("2026-01-26 18:00:00"),
    year: "2025-2026",
  },
  {
    name: "Audrey Wisch, Drew Bent, Rob Reich",
    role: "Anthropic, Curious Cardinals, Stanford",
    background: "Panel on AI ethics, education, and industry perspectives.",
    date: new Date("2026-01-22 18:00:00"),
    year: "2025-2026",
  },
  // {
  //   name: "Bret Taylor",
  //   role: "CEO, Sierra; Chair, OpenAI Board",
  //   background: "Ex-CTO of Facebook, CEO of Salesforce, created Google Maps.",
  //   date: new Date("2026-01-14 18:00:00"),
  //   year: "2025-2026",
  // },
  {
    name: "Danny Driess",
    role: "Research Scientist, Physical Intelligence",
    background: "Leading researcher in embodied AI and robotics.",
    year: "2025-2026",
  },
  // {
  //   name: "Pat Grady & Alfred Lin",
  //   role: "Managing Partners, Sequoia Capital",
  //   background: "Partners at the world's most iconic venture capital fund.",
  //   year: "2025-2026",
  // },
  {
    name: "Parag Agrawal",
    role: "Founder & CEO, Parallel Web Systems",
    background: "Former CEO of Twitter",
    date: new Date("2025-10-02 18:00:00"),
    year: "2025-2026",
  },
  {
    name: "Ishan Mukherjee",
    role: "CEO, Rox",
    background: "Founder of Rox, building the AI native CRM.",
    date: new Date("2025-10-08 18:00:00"),
    year: "2025-2026",
  },
  {
    name: "Dan Fu",
    role: "Professor, UCSD",
    background:
      "Creator of FlashAttention and ThunderKittens, foundational systems ML GPU kernels.",
    date: new Date("2025-10-13 17:00:00"),
    year: "2025-2026",
  },
  {
    name: "Jason Wei",
    role: "Researcher, Meta Superintelligence Labs",
    background: "Co-developed Chain-of-Thought reasoning models at OpenAI - o1, o3.",
    date: new Date("2025-10-16 18:00:00"),
    year: "2025-2026",
  },
  {
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
    background: "Founder of Vercel and Next.js.",
    date: new Date("2025-11-04 15:00:00"),
    year: "2025-2026",
  },
  {
    name: "Jeff Dean",
    role: "Chief Scientist, Google",
    background: "Leads all research at Google, Google DeepMind, Waymo, etc.",
    date: new Date("2025-11-18 17:00:00"),
    year: "2025-2026",
  },
  {
    name: "Sam Altman",
    role: "CEO, OpenAI",
    background: "Co-founder of OpenAI and former President of Y Combinator.",
    year: "2024-2025",
  },
  {
    name: "François Chollet",
    role: "Founder, ARC Prize",
    background: "Creator of Keras at Google and author of 'Deep Learning with Python'.",
    year: "2024-2025",
  },
  {
    name: "Nicholas Carlini",
    role: "Research Scientist, Anthropic",
    background: "Specialist in AI safety, formerly at Google DeepMind and Google Brain.",
    year: "2024-2025",
  },
  {
    name: "Evan Hubinger",
    role: "Research Scientist, Anthropic",
    background: "Focuses on alignment and safety. Formerly at OpenAI and Google.",
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
    background: "Founded one of the top AI video generation model labs, Pika",
    year: "2024-2025",
  },
];

export default function SpeakerContent() {
  const speakersByYear = allSpeakers.reduce((acc, speaker) => {
    if (!acc[speaker.year]) {
      acc[speaker.year] = [];
    }
    acc[speaker.year].push(speaker);
    return acc;
  }, {} as Record<string, Speaker[]>);

  const sortedYears = Object.keys(speakersByYear).sort((a, b) => b.localeCompare(a));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-12"
    >
      {sortedYears.map((year) => (
        <div key={year} className="flex flex-col gap-8">
          <h2 className="text-2xl font-medium text-white/80">{year}</h2>
          <div className="flex flex-col gap-8">
            {speakersByYear[year]
              .sort((a, b) => {
                if (a.date && b.date) {
                  return b.date.getTime() - a.date.getTime();
                }
                return 0;
              })
              .map((speaker, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    opacity: { duration: 0.5, delay: index * 0.1 },
                    y: { duration: 0.2, delay: index * 0.05 },
                  }}
                  className="group relative rounded-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                        <h3 className="text-xl md:text-2xl font-medium text-white transition-colors">
                          {speaker.name}
                        </h3>
                        <span className="text-white/60 text-base md:text-lg font-medium">
                          {speaker.role}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm md:text-md leading-relaxed truncate group-hover:whitespace-normal transition-all">
                        {speaker.background}
                      </p>
                    </div>

                    {speaker.date && (
                      <div className="flex items-center gap-2 text-white/50 text-xs font-medium uppercase tracking-wider whitespace-nowrap shrink-0 px-3 py-1.5 rounded-sm">
                        <CalendarIcon className="w-3 h-3" />
                        <span>
                          {speaker.date.toLocaleDateString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
