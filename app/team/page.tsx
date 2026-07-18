"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import BackLink from "@/components/back-link";

const NBSP = String.fromCharCode(160);

interface TeamMember {
  name: string;
  linkedin?: string;
  twitter?: string;
}

const EXECUTIVE_TEAM: TeamMember[] = [
  {
    name: "Tanvir Bhathal",
    linkedin: "https://www.linkedin.com/in/tanvir-bhathal/",
    twitter: "https://x.com/BhathalTanvir0",
  },
  {
    name: "Jason Zhang",
    linkedin: "https://www.linkedin.com/in/jason-zhang-6860361b8/",
    twitter: "https://x.com/minisounds",
  },
  {
    name: "Shobhit Agarwal",
    linkedin: "https://www.linkedin.com/in/shobhit-ag",
    twitter: "https://x.com/shoagarwal",
  },
  {
    name: "Grace Luo",
    linkedin: "https://www.linkedin.com/in/grace-luo-044370175/",
  },
];

const ALUMNI: TeamMember[] = [
  {
    name: "Sally Zhu",
    linkedin: "https://www.linkedin.com/in/sally-zhu-937b7b127/",
    twitter: "https://x.com/SallyHZhu",
  },
  {
    name: "Asanshay Gupta",
    linkedin: "https://www.linkedin.com/in/asanshay/",
    twitter: "https://x.com/AsanshayG",
  },
  {
    name: "Ethan Boneh",
    linkedin: "https://www.linkedin.com/in/ethan-boneh/",
    twitter: "https://x.com/ethanboneh",
  },
  {
    name: "Chandra Suda",
    linkedin: "https://www.linkedin.com/in/chandrasuda",
    twitter: "https://x.com/chandrasudak",
  },
  {
    name: "Sheryl Hsu",
    linkedin: "https://www.linkedin.com/in/sheryl-hsu-83b84a183/",
  },
  {
    name: "Shreyas Kar",
    linkedin: "https://www.linkedin.com/in/shreyas-kar/",
    twitter: "https://x.com/KarShreyas",
  },
  {
    name: "Sazzad Islam",
    linkedin: "https://www.linkedin.com/in/sazzad14/",
    twitter: "https://x.com/sazzadir14",
  },
  {
    name: "Quinn McIntyre",
    linkedin: "https://www.linkedin.com/in/quinn-mcintyre/",
  },
  {
    name: "Arjun Vikram",
    linkedin: "https://www.linkedin.com/in/arjun-vikram/",
  },
  {
    name: "Kushal Thaman",
    linkedin: "https://www.linkedin.com/in/k-thaman/",
    twitter: "https://x.com/kushal1t",
  },
  {
    name: "William Liu",
    linkedin: "https://www.linkedin.com/in/williamsliu/",
  },
];

function AnimatedTitle({ text }: { text: string }) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".title-letter",
        { yPercent: 120, rotate: -16 },
        {
          yPercent: 0,
          rotate: 0,
          transformOrigin: "0% 100%",
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.075,
          delay: 0.15,
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={rootRef}
      aria-label={text}
      className="mt-8 whitespace-nowrap text-5xl font-medium leading-[0.95] tracking-tight text-neutral-900 sm:text-8xl"
    >
      {text.split("").map((character, index) => (
        <span
          key={index}
          aria-hidden
          className="inline-block overflow-hidden px-[0.06em] align-bottom -mx-[0.06em]"
        >
          <span className="title-letter inline-block will-change-transform">
            {character === " " ? NBSP : character}
          </span>
        </span>
      ))}
    </h1>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ProfileLink({
  href,
  network,
  name,
}: {
  href: string;
  network: "LinkedIn" | "X";
  name: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on ${network}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black/35 transition-all duration-200 hover:bg-[#8C1515] hover:text-white focus-visible:bg-[#8C1515] focus-visible:text-white focus-visible:outline-none"
    >
      {network === "LinkedIn" ? <LinkedInIcon /> : <XIcon />}
    </a>
  );
}

function TeamSection({
  title,
  members,
}: {
  title: string;
  members: TeamMember[];
}) {
  const headingId = `${title.toLowerCase().replaceAll(" ", "-")}-heading`;

  return (
    <section
      className="mt-9 grid sm:mt-11 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8"
      aria-labelledby={headingId}
    >
      <div className="pb-2 sm:pb-0 sm:pt-2">
        <h2 id={headingId} className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/40">
          {title}
        </h2>
      </div>

      <ul className="group/list flex flex-col">
        {members.map((member) => (
          <li
            key={member.name}
            className="group/row flex min-h-10 items-center justify-between gap-4"
          >
            <span className="text-[15px] font-medium tracking-[-0.015em] text-neutral-900 transition-colors duration-200 sm:text-base sm:group-hover/list:text-black/25 sm:group-hover/row:!text-neutral-900 sm:group-focus-within/row:!text-neutral-900">
              {member.name}
            </span>
            <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity duration-200 group-hover/row:opacity-100 group-focus-within/row:opacity-100 sm:opacity-45">
              {member.linkedin ? (
                <ProfileLink
                  href={member.linkedin}
                  network="LinkedIn"
                  name={member.name}
                />
              ) : null}
              {member.twitter ? (
                <ProfileLink href={member.twitter} network="X" name={member.name} />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TeamPage() {
  return (
    <main className="min-h-dvh bg-white text-neutral-900">
      <BackLink className="fixed left-3 top-3 z-30 text-neutral-900 sm:left-6 sm:top-6" />

      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-[4.75rem] md:px-10">
        <AnimatedTitle text="Team" />

        <TeamSection title="Executive Team" members={EXECUTIVE_TEAM} />
        <TeamSection title="Alumni" members={ALUMNI} />
      </div>
    </main>
  );
}
