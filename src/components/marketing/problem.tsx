"use client";

import type { CSSProperties } from "react";
import { useReveal } from "./use-reveal";

export function Problem() {
  const refA = useReveal<HTMLDivElement>();
  const refB = useReveal<HTMLDivElement>();
  return (
    <section className="relative text-[color:var(--fb-ink)]">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-26">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-14 lg:gap-20">
          <div ref={refA} className="fb-reveal">
            <p className="fb-mono mb-6 text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)]">
              The shift
            </p>
            <h2 className="fb-display text-[clamp(40px,6vw,76px)] font-[700] leading-[1.02] text-[color:var(--fb-ink)]">
              Automation tools
              <br />
              forgot they were
              <br />
              <span className="italic text-[color:var(--fb-accent-ink)]">
                software.
              </span>
            </h2>
          </div>
          <div
            ref={refB}
            className="fb-reveal flex items-end"
            style={{ "--fb-stagger": 2 } as CSSProperties}
          >
            <div className="max-w-[60ch] text-[17px] leading-[1.65] text-[color:var(--fb-ink-soft)]">
              <p className="mb-6">
                Zapier hides your logic behind a wizard. n8n asks you to run a
                database and a queue yourself. The low-code tools you inherited
                behave like furniture — useful until you need to move them.
              </p>
              <p>
                Flowbase treats automations the way your code is treated. Typed
                inputs. Real executions. Branching you can reason about. Logs
                you can grep. One binary you can host anywhere a container runs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
