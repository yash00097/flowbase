"use client";

import { useReveal } from "./use-reveal";

const builtWith: Array<{ name: string; href: string }> = [
  { name: "Next.js", href: "https://nextjs.org/" },
  { name: "Inngest", href: "https://www.inngest.com/" },
  { name: "Neon", href: "https://neon.com/" },
  { name: "Shadcn UI", href: "https://ui.shadcn.com/" },
  { name: "tRPC", href: "https://trpc.io/" },
  { name: "React Flow", href: "https://reactflow.dev/" },
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
          {builtWith.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="fb-display cursor-pointer text-[18px] font-[500] text-[color:var(--fb-ink-soft)] transition-colors hover:text-[color:var(--fb-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fb-accent)]"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
