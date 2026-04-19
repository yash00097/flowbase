"use client";

import Image from "next/image";
import { useReveal } from "./use-reveal";

const integrations: Array<{ name: string; src: string }> = [
  { name: "Gmail", src: "/logos/gmail.svg" },
  { name: "Telegram", src: "/logos/telegram.svg" },
  { name: "WhatsApp", src: "/logos/whatsapp.svg" },
  { name: "Webhooks", src: "/logos/webhook.svg" },
  { name: "Slack", src: "/logos/slack.svg" },
  { name: "Discord", src: "/logos/discord.svg" },
  { name: "Anthropic", src: "/logos/anthropic.svg" },
  { name: "OpenAI", src: "/logos/openai.svg" },
  { name: "Gemini", src: "/logos/gemini.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "Google Form", src: "/logos/googleform.svg" },
];

export function Integrations() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="integrations" className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-26">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="fb-mono mb-5 text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)]">
              Integrations
            </p>
            <h2 className="fb-display max-w-[20ch] text-[clamp(38px,5.5vw,64px)] font-[700] leading-[1.02] text-[color:var(--fb-ink)]">
              Connects to the tools <br />
              <span className="italic text-[color:var(--fb-accent-ink)]">
                you already pay for.
              </span>
            </h2>
          </div>
          <p className="max-w-[38ch] text-[15.5px] leading-[1.6] text-[color:var(--fb-ink-soft)]">
            First-class integrations for messaging, AI providers, payments, and
            anything with an HTTP endpoint.
          </p>
        </div>
        <div
          ref={ref}
          className="fb-reveal grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-[color:var(--fb-rule)] bg-[color:var(--fb-rule)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {integrations.map((i) => (
            <div
              key={i.name}
              className="group relative flex aspect-[3/2] flex-col items-start justify-between bg-[color:var(--fb-paper)] p-5 transition-colors duration-300 hover:bg-[color:var(--fb-paper-2)]"
            >
              <Image
                src={i.src}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain opacity-90 transition-transform duration-300 ease-[var(--fb-ease-out)] group-hover:scale-[1.08]"
              />
              <span className="fb-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--fb-ink-muted)] transition-colors group-hover:text-[color:var(--fb-ink)]">
                {i.name}
              </span>
            </div>
          ))}
          <div className="flex aspect-[3/2] flex-col items-start justify-between bg-[color:var(--fb-paper)] p-5">
            <span className="fb-display text-[22px] font-[500] text-[color:var(--fb-accent-ink)]">
              +more
            </span>
            <span className="fb-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--fb-ink-muted)]">
              any http endpoint
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
