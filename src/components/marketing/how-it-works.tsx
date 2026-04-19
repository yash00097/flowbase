"use client";

import type { CSSProperties } from "react";
import { useReveal } from "./use-reveal";

const steps = [
  {
    no: "01",
    title: "Compose",
    body: "Open the canvas. Drop a trigger, drag nodes into place, wire them together. Every edge is typed.",
  },
  {
    no: "02",
    title: "Run",
    body: "Flowbase topologically sorts your graph and dispatches it to Inngest. Retries, steps, replay — built in.",
  },
  {
    no: "03",
    title: "Observe",
    body: "Status streams into the editor as the workflow executes. Drill into any node for payload, timing, errors.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-26">
        <p className="fb-mono mb-5 text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)]">
          How it works
        </p>
        <h2 className="fb-display max-w-[20ch] text-[clamp(38px,5.5vw,64px)] font-[700] leading-[1.02] text-[color:var(--fb-ink)]">
          Three moves, end to end.
        </h2>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[28px] hidden h-px bg-[color:var(--fb-rule)] md:block"
          />
          {steps.map((s, i) => (
            <Step key={s.no} index={i} step={s} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className="fb-reveal relative"
      style={{ "--fb-stagger": index * 2 } as CSSProperties}
    >
      <div className="relative flex items-center gap-4">
        <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[color:var(--fb-rule)] bg-[color:var(--fb-paper)] text-[color:var(--fb-accent-ink)]">
          <span className="fb-mono fb-tnum text-[13px] tracking-[0.05em]">
            {step.no}
          </span>
        </span>
        <span className="fb-display text-[26px] font-[500] text-[color:var(--fb-ink)]">
          {step.title}
        </span>
      </div>
      <p className="mt-6 max-w-[42ch] text-[15.5px] leading-[1.6] text-[color:var(--fb-ink-soft)]">
        {step.body}
      </p>
    </li>
  );
}
