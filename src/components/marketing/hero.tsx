"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GithubGlyph } from "./glyphs";
import { useReveal } from "./use-reveal";

export function Hero() {
  const revealA = useReveal<HTMLHeadingElement>();
  const revealB = useReveal<HTMLParagraphElement>();
  const revealC = useReveal<HTMLDivElement>();
  const revealD = useReveal<HTMLDivElement>();
  const revealEyebrow = useReveal<HTMLParagraphElement>();
  const revealMeta = useReveal<HTMLParagraphElement>();
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1280px] px-6 pt-16 pb-16 md:px-10 md:pt-24 md:pb-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-14 lg:gap-20">
          <div className="max-w-[640px]">
            <p
              className="fb-mono mb-5 flex items-center gap-2 text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)] fb-reveal"
              ref={revealEyebrow}
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--fb-live)] fb-pulse"
              />
              Flowbase · Visual workflow engine
            </p>
            <h1
              ref={revealA}
              className="fb-display fb-reveal text-[clamp(56px,9vw,112px)] font-[700] text-[color:var(--fb-ink)]"
              style={{ "--fb-stagger": 0 } as CSSProperties}
            >
              Automate
              <br />
              <span className="italic text-[color:var(--fb-accent-ink)]">
                like you code.
              </span>
            </h1>
            <p
              ref={revealB}
              className="fb-reveal mt-6 max-w-[56ch] text-[17px] leading-[1.55] text-[color:var(--fb-ink-soft)]"
              style={{ "--fb-stagger": 2 } as CSSProperties}
            >
              A visual workflow engine for developers who ship — typed nodes,
              real executions, first-class observability, and no vendor moat.
              Compose it in the canvas, run it on your infra.
            </p>
            <div
              ref={revealC}
              className="fb-reveal mt-8 flex flex-wrap items-center gap-3"
              style={{ "--fb-stagger": 4 } as CSSProperties}
            >
              <Link
                href="/sign-up"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--fb-accent)] px-6 text-[15px] font-[500] text-[color:var(--fb-paper)] transition-transform duration-200 ease-[var(--fb-ease-out)] hover:-translate-y-[2px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--fb-accent)]"
              >
                Try Flowbase
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 ease-[var(--fb-ease-out)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                />
              </Link>
              <Link
                href="https://github.com/yash00097/flowbase"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-[500] text-[color:var(--fb-ink)] transition-colors duration-200 hover:bg-[color:var(--fb-paper-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fb-accent)]"
              >
                <GithubGlyph className="h-[18px] w-[18px]" />
                View on GitHub
              </Link>
            </div>
            <p
              className="fb-mono fb-reveal mt-6 text-[12px] text-[color:var(--fb-ink-muted)]"
              style={{ "--fb-stagger": 6 } as CSSProperties}
              ref={revealMeta}
            >
              MIT · Self-hostable · <span className="fb-tnum">v0.1.0</span>
            </p>
          </div>

          <div
            ref={revealD}
            className="fb-reveal relative"
            style={{ "--fb-stagger": 3 } as CSSProperties}
          >
            <HeroGraph />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroGraph() {
  return (
    <div className="relative aspect-[4/4.3] w-full max-w-[560px] justify-self-end overflow-hidden rounded-[20px] border border-white/[0.06] bg-[oklch(0.14_0.015_285)] shadow-[0_30px_80px_-20px_oklch(0.2_0.05_285/0.5)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(0.3_0.02_285)_1px,transparent_1.1px)] [background-size:18px_18px] opacity-60"
      />
      <svg
        viewBox="0 0 560 600"
        className="relative z-10 h-full w-full"
        aria-label="Flowbase canvas preview"
        role="img"
      >
        <title>Flowbase canvas preview</title>
        <defs>
          <linearGradient id="fb-gemini-border" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.75 0.18 25)" />
            <stop offset="50%" stopColor="oklch(0.8 0.16 55)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 290)" />
          </linearGradient>
        </defs>

        {/* Edges */}
        <g fill="none" strokeWidth={1.5}>
          {/* Form → If */}
          <path
            d="M 100 290 C 150 290, 150 280, 200 280"
            stroke="oklch(0.8 0.11 175)"
            strokeOpacity={0.9}
          />
          {/* If → Gemini */}
          <path
            d="M 280 260 C 300 260, 305 190, 325 190"
            stroke="oklch(0.8 0.11 175)"
            strokeOpacity={0.85}
          />
          {/* Gemini → Telegram (top) */}
          <path
            d="M 405 190 C 420 190, 420 100, 435 100"
            stroke="oklch(0.8 0.11 175)"
            strokeOpacity={0.85}
          />
          {/* If → Telegram (bottom) */}
          <path
            d="M 280 320 C 300 320, 305 420, 325 420"
            stroke="oklch(0.8 0.11 175)"
            strokeOpacity={0.85}
          />
        </g>

        {/* Google Form trigger (trigger node - rounded left) */}
        <g>
          <path
            d="M 32 250 L 100 250 L 100 330 L 32 330 Q 20 330 20 318 L 20 262 Q 20 250 32 250 Z"
            fill="oklch(0.18 0.02 288)"
            stroke="oklch(0.62 0.17 290)"
            strokeOpacity={0.85}
            strokeWidth={1.4}
          />
          <image href="/logos/googleform.svg" x={40} y={270} width={40} height={40} />
          <text
            x={60}
            y={348}
            textAnchor="middle"
            fontFamily="var(--fb-font-body)"
            fontSize={11}
            fontWeight={600}
            fill="oklch(0.94 0.01 285)"
          >
            Google Form
          </text>
          <text
            x={60}
            y={362}
            textAnchor="middle"
            fontFamily="var(--fb-font-mono)"
            fontSize={9}
            fill="oklch(0.62 0.02 285)"
          >
            submitted
          </text>
          <circle cx={100} cy={290} r={3.5} fill="oklch(0.55 0.02 285)" />
        </g>

        {/* If Logic */}
        <g>
          <rect
            x={200}
            y={240}
            width={80}
            height={80}
            rx={12}
            fill="oklch(0.17 0.015 285)"
            stroke="oklch(0.34 0.02 285)"
            strokeWidth={1.4}
          />
          <image href="/logos/if.svg" x={220} y={255} width={40} height={40} />
          <text
            x={240}
            y={338}
            textAnchor="middle"
            fontFamily="var(--fb-font-body)"
            fontSize={11}
            fontWeight={600}
            fill="oklch(0.94 0.01 285)"
          >
            If
          </text>
          <text
            x={240}
            y={352}
            textAnchor="middle"
            fontFamily="var(--fb-font-mono)"
            fontSize={8}
            fill="oklch(0.62 0.02 285)"
          >
            field &gt; 0
          </text>
          <circle cx={200} cy={280} r={3.5} fill="oklch(0.55 0.02 285)" />
          <circle cx={280} cy={260} r={3.5} fill="oklch(0.75 0.17 155)" />
          <circle cx={280} cy={320} r={3.5} fill="oklch(0.65 0.22 25)" />
        </g>

        {/* Gemini */}
        <g>
          <rect
            x={325}
            y={150}
            width={80}
            height={80}
            rx={12}
            fill="oklch(0.17 0.015 285)"
            stroke="url(#fb-gemini-border)"
            strokeWidth={1.6}
          />
          <image href="/logos/gemini.svg" x={345} y={165} width={40} height={40} />
          <text
            x={365}
            y={248}
            textAnchor="middle"
            fontFamily="var(--fb-font-body)"
            fontSize={11}
            fontWeight={600}
            fill="oklch(0.94 0.01 285)"
          >
            Gemini
          </text>
          <text
            x={365}
            y={262}
            textAnchor="middle"
            fontFamily="var(--fb-font-mono)"
            fontSize={8}
            fill="oklch(0.62 0.02 285)"
          >
            generate...
          </text>
          <circle cx={325} cy={190} r={3.5} fill="oklch(0.55 0.02 285)" />
          <circle cx={405} cy={190} r={3.5} fill="oklch(0.55 0.02 285)" />
        </g>

        {/* Discord (top) */}
        <g>
          <rect
            x={435}
            y={60}
            width={80}
            height={80}
            rx={12}
            fill="oklch(0.17 0.015 285)"
            stroke="oklch(0.62 0.17 280)"
            strokeOpacity={0.9}
            strokeWidth={1.4}
          />
          <image href="/logos/discord.svg" x={455} y={75} width={40} height={40} />
          <text
            x={475}
            y={158}
            textAnchor="middle"
            fontFamily="var(--fb-font-body)"
            fontSize={11}
            fontWeight={600}
            fill="oklch(0.94 0.01 285)"
          >
            Discord
          </text>
          <text
            x={475}
            y={172}
            textAnchor="middle"
            fontFamily="var(--fb-font-mono)"
            fontSize={8}
            fill="oklch(0.62 0.02 285)"
          >
            Send msg
          </text>
          <circle cx={435} cy={100} r={3.5} fill="oklch(0.55 0.02 285)" />
        </g>

        {/* Telegram (bottom) */}
        <g>
          <rect
            x={325}
            y={380}
            width={80}
            height={80}
            rx={12}
            fill="oklch(0.17 0.015 285)"
            stroke="oklch(0.65 0.13 225)"
            strokeOpacity={0.9}
            strokeWidth={1.4}
          />
          <image href="/logos/telegram.svg" x={345} y={395} width={40} height={40} />
          <text
            x={365}
            y={478}
            textAnchor="middle"
            fontFamily="var(--fb-font-body)"
            fontSize={11}
            fontWeight={600}
            fill="oklch(0.94 0.01 285)"
          >
            Telegram
          </text>
          <text
            x={365}
            y={492}
            textAnchor="middle"
            fontFamily="var(--fb-font-mono)"
            fontSize={8}
            fill="oklch(0.62 0.02 285)"
          >
            Permission...
          </text>
          <circle cx={325} cy={420} r={3.5} fill="oklch(0.55 0.02 285)" />
        </g>

        {/* Status pill (green dot removed) */}
        <g transform="translate(24, 548)">
          <rect
            x={0}
            y={0}
            rx={999}
            ry={999}
            width={170}
            height={28}
            fill="oklch(0.17 0.015 285)"
            stroke="oklch(0.32 0.02 285)"
          />
          <text
            x={12}
            y={18}
            fontFamily="var(--fb-font-mono)"
            fontSize={10}
            fill="oklch(0.78 0.02 285)"
          >
            run · 142ms · success
          </text>
        </g>
      </svg>
    </div>
  );
}