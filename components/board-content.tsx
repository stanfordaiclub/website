import { motion } from "framer-motion";
import BoardMemberCard, { BoardMember } from "@/components/board-member-card";

const BOARD_MEMBERS: BoardMember[] = [
  {
    name: "Tanvir Bhathal",
    title: "Co-President",
    image: "/board/tanvir.png",
    links: {
      linkedin: "https://www.linkedin.com/in/tanvir-bhathal/",
      github: "https://github.com/mrTSB",
      twitter: "https://x.com/BhathalTanvir0",
      googleScholar: "https://scholar.google.com/citations?hl=en&user=bnc3of4AAAAJ",
    },
  },

  {
    name: "Jason Zhang",
    title: "Co-President",
    image: "/board/jason.jpeg",
    links: {
      linkedin: "https://www.linkedin.com/in/jason-zhang-6860361b8/",
      twitter: "https://x.com/minisounds",
      website: "https://jasonzhang.info",
      googleScholar: "https://scholar.google.com/citations?user=LY1rce8AAAAJ&hl=en&authuser=1",
    },
  },
  {
    name: "Sally Zhu",
    title: "President Emeritus",
    image: "/board/sally.png",
    links: {
      linkedin: "https://www.linkedin.com/in/sally-zhu-937b7b127/",
      twitter: "https://x.com/SallyHZhu",
      website: "https://salzhu.github.io/",
      googleScholar:
        "https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=8JOQdDkAAAAJ",
      github: "https://github.com/salzhu",
    },
  },

  {
    name: "Asanshay Gupta",
    title: "Design",
    image: "/board/asanshay.jpg",
    links: {
      linkedin: "https://www.linkedin.com/in/asanshay/",
      twitter: "https://x.com/AsanshayG",
      website: "https://asanshay.com",
      googleScholar: "https://scholar.google.com/citations?hl=en&user=agB2x10AAAAJ",
      github: "https://github.com/SuperAce100",
    },
  },
  {
    name: "Grace Luo",
    title: "Financial Officer",
    image: "/board/grace.jpeg",
    links: {
      linkedin: "https://www.linkedin.com/in/grace-luo-044370175/",
    },
  },
  {
    name: "Ethan Boneh",
    title: "Financial Officer",
    image: "/board/ethan.png",
    links: {
      linkedin: "https://www.linkedin.com/in/ethan-boneh/",
      twitter: "https://x.com/ethanboneh",
      github: "https://github.com/ethanboneh",
      ieee: "https://ieeexplore-ieee-org.stanford.idm.oclc.org/author/335166912586583",
    },
  },
  {
    name: "Chandra Suda",
    title: "Media",
    image: "/board/chandra.jpeg",
    links: {
      linkedin: "https://www.linkedin.com/in/chandrasuda",
      twitter: "https://x.com/chandrasudak",
      website: "https://chandrasuda.com",
      googleScholar: "https://scholar.google.com/citations?user=uJc_OLYAAAAJ&hl=en",
      github: "https://github.com/chandrasuda",
    },
  },
];

const FORMER_BOARD_MEMBERS: BoardMember[] = [
  {
    name: "Kushal Thaman",
    title: "Research",
    image: "/board/kushal.png",
    links: {
      linkedin: "https://www.linkedin.com/in/k-thaman/",
      twitter: "https://x.com/kushal1t",
      website: "https://cs.stanford.edu/~kushalt/",
      googleScholar: "https://scholar.google.com/citations?user=89nZKJgAAAAJ",
      github: "https://github.com/kushalthaman",
    },
  },
];

export default function BoardContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto px-6 pb-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-start items-start ">
        {BOARD_MEMBERS.map((member, index) => (
          <BoardMemberCard key={index} {...member} index={index} />
        ))}
      </div>

      <h2 className="text-2xl font-medium text-white/80 mt-16 mb-8">Former Board Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-start items-start ">
        {FORMER_BOARD_MEMBERS.map((member, index) => (
          <BoardMemberCard key={index} {...member} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
