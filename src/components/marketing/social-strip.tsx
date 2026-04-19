"use client";

import { useReveal } from "./use-reveal";

const builtWith = [
  "Next.js",
  "Inngest",
  "Prisma",
  "PostgreSQL",
  "tRPC",
  "React Flow",
];

export function SocialStrip() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section>
      <div
        ref={ref}
        className="fb-reveal mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:gap-12 md:px-10"
      >
        <p className="fb-mono text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)] whitespace-nowrap">
          Built with
        </p>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {builtWith.map((name) => (
            <li
              key={name}
              className="fb-display text-[18px] font-[500] text-[color:var(--fb-ink-soft)] transition-colors hover:text-[color:var(--fb-ink)] hover:cursor-pointer"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
