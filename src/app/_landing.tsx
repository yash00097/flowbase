"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// ────────────────────────────────────────────────────────────────────
// Static content
// ────────────────────────────────────────────────────────────────────

type NodeItem = {
  name: string;
  logo: string;
  accent: string;
};

const nodeGroups: { label: string; items: NodeItem[] }[] = [
  {
    label: "Triggers",
    items: [
      { name: "Manual", logo: "/logos/logo.svg", accent: "#a5b4fc" },
      { name: "Webhook", logo: "/logos/webhook.svg", accent: "#a5b4fc" },
      { name: "Google Form", logo: "/logos/googleform.svg", accent: "#a855f7" },
      { name: "Stripe", logo: "/logos/stripe.svg", accent: "#635bff" },
    ],
  },
  {
    label: "AI & LLM",
    items: [
      { name: "OpenAI", logo: "/logos/openai.svg", accent: "#74aa9c" },
      { name: "Anthropic", logo: "/logos/anthropic.svg", accent: "#d97757" },
      { name: "Gemini", logo: "/logos/gemini.svg", accent: "#4285f4" },
    ],
  },
  {
    label: "Messaging",
    items: [
      { name: "Slack", logo: "/logos/slack.svg", accent: "#e01e5a" },
      { name: "Discord", logo: "/logos/discord.svg", accent: "#5865f2" },
      { name: "Telegram", logo: "/logos/telegram.svg", accent: "#26a5e4" },
      { name: "WhatsApp", logo: "/logos/whatsapp.svg", accent: "#25d366" },
    ],
  },
  {
    label: "Utilities",
    items: [
      { name: "HTTP Request", logo: "/logos/webhook.svg", accent: "#22d3ee" },
      { name: "IF / Branch", logo: "/logos/if.svg", accent: "#34d399" },
      { name: "Gmail", logo: "/logos/gmail.svg", accent: "#ea4335" },
    ],
  },
];

const roadmap = [
  "Google Sheets",
  "Notion",
  "Airtable",
  "Supabase",
  "Switch / Router",
  "Loop / Iterator",
  "Schedule / Cron",
  "Code Function",
  "Merge",
];

// ────────────────────────────────────────────────────────────────────
// Reveal (IntersectionObserver fade-up)
// ────────────────────────────────────────────────────────────────────

function Reveal({
  children,
  className = "",
  as: Tag = "section",
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "header" | "footer";
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
      className={`lp-reveal ${visible ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// ────────────────────────────────────────────────────────────────────
// Nav (sticky, blur-on-scroll)
// ────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`lp-nav ${scrolled ? "lp-nav-scrolled" : ""}`}>
      <div className="lp-nav-inner">
        <Link href="/" className="lp-nav-logo">
          <Image
            src="/logos/logo.svg"
            alt="Flowbase"
            width={28}
            height={28}
            priority
          />
          <span className="lp-display lp-nav-wordmark">flowbase</span>
        </Link>

        <nav className="lp-nav-links">
          <a href="#demo">Product</a>
          <a href="#nodes">Nodes</a>
          <a href="#open-source">Developers</a>
          <Link href="/pricing">Pricing</Link>
        </nav>

        <div className="lp-nav-cta">
          <Button asChild variant="ghost" size="sm" className="lp-btn-ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="lp-btn-primary">
            <Link href="/signup">
              Get started
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────
// Tiny SVG icons (no lucide dependency for these primitives)
// ────────────────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDesign = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    width="40"
    height="40"
    aria-hidden="true"
  >
    <rect
      x="4"
      y="6"
      width="12"
      height="10"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="24"
      y="6"
      width="12"
      height="10"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="24"
      width="12"
      height="10"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 16v2a3 3 0 0 0 3 3h7m10-5v2a3 3 0 0 1-3 3h-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="10" cy="11" r="1.4" fill="currentColor" />
    <circle cx="30" cy="11" r="1.4" fill="#22d3ee" />
    <circle cx="20" cy="29" r="1.4" fill="currentColor" />
  </svg>
);

const IconConnect = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    width="40"
    height="40"
    aria-hidden="true"
  >
    <path
      d="M8 20h9M23 20h9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="8" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="32" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17 16h6v8h-6z" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M18.5 13v3M21.5 13v3M18.5 24v3M21.5 24v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconDeploy = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    width="40"
    height="40"
    aria-hidden="true"
  >
    <path
      d="M12 28 28 12M28 12h-8M28 12v8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="20"
      cy="20"
      r="13"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.35"
    />
    <circle
      cx="20"
      cy="20"
      r="17"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.15"
    />
  </svg>
);

const IconRealtime = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="1.4"
      opacity="0.45"
    />
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.2"
    />
  </svg>
);

const IconBranch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6 8v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M12 14v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IconTemplate = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width="18"
    height="18"
    aria-hidden="true"
  >
    <path
      d="M8 4 4 12l4 8M16 4l4 8-4 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGithub = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.7.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
  </svg>
);

// ────────────────────────────────────────────────────────────────────
// Main Landing
// ────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <>
      <GlobalStyles />
      <div className="lp-root">
        {/* ambient glow */}
        <div className="lp-orb lp-orb-1" aria-hidden />
        <div className="lp-orb lp-orb-2" aria-hidden />
        <div className="lp-grid" aria-hidden />

        <Nav />

        <main className="lp-main">
          {/* ── HERO ───────────────────────────────────────────── */}
          <section className="lp-hero">
            <div className="lp-hero-inner">
              <div className="lp-load" style={{ ["--i" as string]: 0 }}>
                <span className="lp-pill">
                  <span className="lp-pill-dot" />
                  v0.9 · dogfooded in production
                </span>
              </div>

              <h1
                className="lp-h1 lp-display lp-load"
                style={{ ["--i" as string]: 1 }}
              >
                <span className="lp-h1-gradient">Wire your stack.</span>
                <br />
                Ship the workflow.
              </h1>

              <p
                className="lp-hero-sub lp-load"
                style={{ ["--i" as string]: 2 }}
              >
                Flowbase is a visual, type-safe workflow engine. Drag nodes onto
                a canvas, chain outputs with{" "}
                <code className="lp-code-inline">{`{{template}}`}</code>{" "}
                variables, and watch every step execute <em>live</em> — streamed
                from Inngest to your browser.
              </p>

              <div
                className="lp-hero-cta lp-load"
                style={{ ["--i" as string]: 3 }}
              >
                <Button asChild size="lg" className="lp-btn-primary lp-btn-lg">
                  <Link href="/signup">
                    Start building free
                    <ArrowRight />
                  </Link>
                </Button>
                <a href="#demo" className="lp-link-quiet">
                  Watch a workflow run
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* Honest stats — no 500+ integrations lies */}
              <div
                className="lp-stats lp-load"
                style={{ ["--i" as string]: 4 }}
              >
                <div className="lp-stat">
                  <div className="lp-stat-num lp-display">15+</div>
                  <div className="lp-stat-label">node types shipped</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num lp-display">
                    Live
                    <span className="lp-stat-dot" />
                  </div>
                  <div className="lp-stat-label">
                    per-node execution feedback
                  </div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num lp-display">
                    100<span className="lp-stat-pct">%</span>
                  </div>
                  <div className="lp-stat-label">
                    type-safe, tRPC end-to-end
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── DEMO ───────────────────────────────────────────── */}
          <Reveal id="demo" className="lp-section lp-demo">
            <div className="lp-section-head">
              <span className="lp-eyebrow">The editor</span>
              <h2 className="lp-h2 lp-display">
                A canvas that <span className="lp-accent">runs your code.</span>
              </h2>
              <p className="lp-section-sub">
                Every node publishes its own realtime channel. Status pulses
                back into the UI as Inngest executes — no manual refresh, no
                polling.
              </p>
            </div>

            <div className="lp-demo-frame">
              <div className="lp-demo-chrome">
                <div className="lp-traffic">
                  <span /> <span /> <span />
                </div>
                <div className="lp-url">
                  flow-base.dev/workflows/stripe-to-telegram
                </div>
                <div className="lp-chrome-right">
                  <span className="lp-chrome-pill">
                    <span className="lp-chrome-pulse" />
                    running
                  </span>
                </div>
              </div>
              <div className="lp-demo-screen">
                <Image
                  src="/editorDemo.png"
                  alt="Flowbase editor with a Stripe payment node connected to an AI summary node routed to Telegram"
                  width={1657}
                  height={910}
                  className="lp-demo-img"
                  priority
                />

                {/* annotation badges */}
                <div className="lp-ann lp-ann-1">
                  <span
                    className="lp-ann-dot"
                    style={{ background: "#22d3ee" }}
                  />
                  Realtime status via Inngest
                </div>
                <div className="lp-ann lp-ann-2">
                  <span
                    className="lp-ann-dot"
                    style={{ background: "#a5b4fc" }}
                  />
                  {`{{ openai.text }}`} chains outputs
                </div>
                <div className="lp-ann lp-ann-3">
                  <span
                    className="lp-ann-dot"
                    style={{ background: "#34d399" }}
                  />
                  IF branches: green true · red false
                </div>
              </div>
              <div className="lp-demo-glow" aria-hidden />
            </div>
          </Reveal>

          {/* ── HOW IT WORKS ──────────────────────────────────── */}
          <Reveal className="lp-section lp-how">
            <div className="lp-section-head">
              <span className="lp-eyebrow">How it works</span>
              <h2 className="lp-h2 lp-display">
                Three moves. <span className="lp-accent">One canvas.</span>
              </h2>
            </div>

            <div className="lp-how-row">
              {/* connector svg */}
              <svg
                className="lp-how-line"
                viewBox="0 0 1000 80"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="lpConn" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgba(99,102,241,0)" />
                    <stop offset="15%" stopColor="rgba(99,102,241,0.6)" />
                    <stop offset="50%" stopColor="rgba(34,211,238,0.6)" />
                    <stop offset="85%" stopColor="rgba(99,102,241,0.6)" />
                    <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 40 40 C 300 40, 320 40, 500 40 S 780 40, 960 40"
                  stroke="url(#lpConn)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                  fill="none"
                />
              </svg>

              {[
                {
                  num: "01",
                  title: "Design the graph",
                  icon: <IconDesign />,
                  copy: "Drag triggers and actions onto a React Flow canvas. Configure each node in its own dialog — no YAML, no CLI.",
                  tone: "#a5b4fc",
                },
                {
                  num: "02",
                  title: "Chain your data",
                  icon: <IconConnect />,
                  copy: "Reference previous outputs with Handlebars — {{stripe.amount}} feeds directly into the next node's prompt.",
                  tone: "#67e8f9",
                },
                {
                  num: "03",
                  title: "Execute · observe · iterate",
                  icon: <IconDeploy />,
                  copy: "Hit run. Every node streams a live status. Inspect the output payload, rerun in place.",
                  tone: "#a5b4fc",
                },
              ].map((step, i) => (
                <div
                  key={step.num}
                  className="lp-step"
                  style={{ ["--i" as string]: i }}
                >
                  <div className="lp-step-icon" style={{ color: step.tone }}>
                    {step.icon}
                    <span className="lp-step-num">{step.num}</span>
                  </div>
                  <h3 className="lp-step-title lp-display">{step.title}</h3>
                  <p className="lp-step-copy">{step.copy}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── NODE LIBRARY ──────────────────────────────────── */}
          <Reveal id="nodes" className="lp-section lp-nodes">
            <div className="lp-section-head">
              <span className="lp-eyebrow">Node library</span>
              <h2 className="lp-h2 lp-display">
                Real integrations.{" "}
                <span className="lp-accent">Honest inventory.</span>
              </h2>
              <p className="lp-section-sub">
                No "500+ integrations" fiction. Here is every node you can drop
                onto the canvas today.
              </p>
            </div>

            <div className="lp-node-groups">
              {nodeGroups.map((group) => (
                <div key={group.label} className="lp-node-group">
                  <div className="lp-node-group-head">
                    <span className="lp-node-group-label">{group.label}</span>
                    <span className="lp-node-group-count">
                      {group.items.length}
                    </span>
                  </div>
                  <div className="lp-node-grid">
                    {group.items.map((node, i) => (
                      <div
                        key={node.name}
                        className="lp-node-chip"
                        style={{
                          ["--accent" as string]: node.accent,
                          ["--i" as string]: i,
                        }}
                      >
                        <div className="lp-node-logo">
                          <Image
                            src={node.logo}
                            alt={node.name}
                            width={34}
                            height={34}
                          />
                        </div>
                        <div className="lp-node-name">{node.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* roadmap strip */}
            <div className="lp-roadmap">
              <span className="lp-roadmap-label">Next up</span>
              <div className="lp-roadmap-items">
                {roadmap.map((r) => (
                  <span key={r} className="lp-roadmap-chip">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── BENTO FEATURE DEEP-DIVES ──────────────────────── */}
          <Reveal className="lp-section lp-bento-sec">
            <div className="lp-section-head">
              <span className="lp-eyebrow">What makes it work</span>
              <h2 className="lp-h2 lp-display">
                Three things{" "}
                <span className="lp-accent">we rebuilt from scratch.</span>
              </h2>
            </div>

            <div className="lp-bento">
              {/* Card 1 — Realtime streaming (wide) */}
              <div className="lp-bento-card lp-bento-wide">
                <div className="lp-bento-head">
                  <div className="lp-bento-icon" style={{ color: "#67e8f9" }}>
                    <IconRealtime />
                  </div>
                  <div>
                    <h3 className="lp-bento-title lp-display">
                      Real-time execution feedback
                    </h3>
                    <p className="lp-bento-sub">
                      Every executor publishes to a channel via{" "}
                      <code>@inngest/realtime</code>. Status streams into the
                      editor as the workflow runs — not after.
                    </p>
                  </div>
                </div>

                <div className="lp-nodes-mock">
                  {[
                    { name: "stripe.payment", state: "done" },
                    { name: "openai.summarise", state: "running" },
                    { name: "if.amount_gt_100", state: "queued" },
                    { name: "telegram.notify", state: "queued" },
                  ].map((n) => (
                    <div
                      key={n.name}
                      className={`lp-node-row lp-state-${n.state}`}
                    >
                      <span className="lp-node-row-dot" />
                      <span className="lp-node-row-name">{n.name}</span>
                      <span className="lp-node-row-state">{n.state}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2 — IF branching (tall) */}
              <div className="lp-bento-card lp-bento-tall">
                <div className="lp-bento-icon" style={{ color: "#86efac" }}>
                  <IconBranch />
                </div>
                <h3 className="lp-bento-title lp-display">
                  Conditional branching
                </h3>
                <p className="lp-bento-sub">
                  The IF node rewrote our execution engine from topological sort
                  to graph-aware traversal. Color-coded handles: green for true,
                  red for false.
                </p>

                <svg
                  viewBox="0 0 240 160"
                  className="lp-branch-viz"
                  aria-hidden="true"
                >
                  <rect
                    x="90"
                    y="16"
                    width="60"
                    height="32"
                    rx="6"
                    fill="rgba(99,102,241,0.2)"
                    stroke="rgba(165,180,252,0.5)"
                  />
                  <text
                    x="120"
                    y="36"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#c7d2fe"
                    fontFamily="ui-monospace"
                  >
                    IF
                  </text>

                  <path
                    d="M 120 48 C 120 70, 50 72, 50 100"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M 120 48 C 120 70, 190 72, 190 100"
                    stroke="#f87171"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <rect
                    x="20"
                    y="100"
                    width="60"
                    height="32"
                    rx="6"
                    fill="rgba(52,211,153,0.12)"
                    stroke="rgba(52,211,153,0.5)"
                  />
                  <text
                    x="50"
                    y="120"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#86efac"
                    fontFamily="ui-monospace"
                  >
                    notify
                  </text>

                  <rect
                    x="160"
                    y="100"
                    width="60"
                    height="32"
                    rx="6"
                    fill="rgba(248,113,113,0.1)"
                    stroke="rgba(248,113,113,0.45)"
                  />
                  <text
                    x="190"
                    y="120"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#fca5a5"
                    fontFamily="ui-monospace"
                  >
                    skip
                  </text>

                  <circle cx="120" cy="48" r="3" fill="#a5b4fc" />
                  <circle cx="50" cy="100" r="3" fill="#34d399" />
                  <circle cx="190" cy="100" r="3" fill="#f87171" />
                </svg>
              </div>

              {/* Card 3 — Template variables (wide) */}
              <div className="lp-bento-card lp-bento-full">
                <div className="lp-bento-head">
                  <div className="lp-bento-icon" style={{ color: "#c7d2fe" }}>
                    <IconTemplate />
                  </div>
                  <div>
                    <h3 className="lp-bento-title lp-display">
                      Handlebars everywhere
                    </h3>
                    <p className="lp-bento-sub">
                      Every configurable string is a template. Compose node
                      outputs into the next node's inputs without leaving the
                      dialog.
                    </p>
                  </div>
                </div>

                <div className="lp-tmpl-flow">
                  <div className="lp-tmpl-box">
                    <div className="lp-tmpl-label">openai.summarise</div>
                    <div className="lp-tmpl-code">
                      <span className="lp-tk-com">{"/* output */"}</span>
                      <br />
                      {"{ "}
                      <span className="lp-tk-kw">text</span>:{" "}
                      <span className="lp-tk-str">
                        "$184 charged. Upgrade detected."
                      </span>
                      {" }"}
                    </div>
                  </div>

                  <div className="lp-tmpl-arrow" aria-hidden="true">
                    <svg
                      viewBox="0 0 64 24"
                      width="64"
                      height="24"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 12h56M52 6l6 6-6 6"
                        stroke="rgba(165,180,252,0.7)"
                        strokeWidth="1.4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="lp-tmpl-box">
                    <div className="lp-tmpl-label">telegram.notify</div>
                    <div className="lp-tmpl-code">
                      <span className="lp-tk-kw">message</span>:{" "}
                      <span className="lp-tk-str">"New: </span>
                      <span className="lp-tk-var">{"{{openai.text}}"}</span>
                      <span className="lp-tk-str">"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── OPEN SOURCE / DEVELOPER ───────────────────────── */}
          <Reveal id="open-source" className="lp-section lp-os">
            <div className="lp-os-grid">
              <div className="lp-os-copy">
                <span className="lp-eyebrow">Built for developers</span>
                <h2 className="lp-h2 lp-display">
                  No magic. <br />
                  <span className="lp-accent">Just strict TypeScript.</span>
                </h2>
                <p className="lp-section-sub">
                  Next.js 15 · React Flow · tRPC v11 · Prisma · Inngest. Every
                  node is a typed executor — async functions that receive
                  context, publish status, and return the next context. No DSL.
                  No code-generation. No "low-code runtime" you have to trust.
                </p>

                <ul className="lp-os-list">
                  <li>
                    <span className="lp-os-tick" aria-hidden /> Type-safe
                    credential storage (Cryptr + Prisma)
                  </li>
                  <li>
                    <span className="lp-os-tick" aria-hidden /> Inngest
                    durability: steps retry, resume, and idempotent
                  </li>
                  <li>
                    <span className="lp-os-tick" aria-hidden /> tRPC procedures
                    scoped per user — row-level isolation
                  </li>
                  <li>
                    <span className="lp-os-tick" aria-hidden /> One{" "}
                    <code>Node</code> table, JSON config — infinitely extensible
                  </li>
                </ul>

                <div className="lp-os-cta">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="lp-btn-ghost"
                  >
                    <Link
                      href="https://github.com/yash00097/flowbase"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconGithub />
                      View on GitHub
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lp-code">
                <div className="lp-code-tab">
                  <span className="lp-code-tab-dot" />
                  features/executions/components/openai/executor.ts
                </div>
                <pre className="lp-code-block">
                  <code>
                    <span className="lp-tk-com">{`// Strict NodeExecutor<T> contract — every node implements this.`}</span>
                    {"\n"}
                    <span className="lp-tk-kw">{`export const `}</span>
                    <span className="lp-tk-fn">{`openaiExecutor`}</span>
                    {`: `}
                    <span className="lp-tk-kw">{`NodeExecutor`}</span>
                    {`<`}
                    <span className="lp-tk-fn">{`OpenAIData`}</span>
                    {`> = `}
                    <span className="lp-tk-kw">{`async`}</span>
                    {` (`}
                    {"\n"}
                    {`  data, context, userId, step, publish,`}
                    {"\n"}
                    {`) =&gt; `}
                    {"{"}
                    {"\n"}
                    {`  `}
                    <span className="lp-tk-kw">{`await`}</span>
                    {` `}
                    <span className="lp-tk-fn">{`publishStatus`}</span>
                    {`(publish, data.id, `}
                    <span className="lp-tk-str">{`"loading"`}</span>
                    {`);`}
                    {"\n"}
                    {"\n"}
                    {`  `}
                    <span className="lp-tk-kw">{`const`}</span>
                    {` prompt = `}
                    <span className="lp-tk-fn">{`compile`}</span>
                    {`(data.prompt)(context);`}
                    {"\n"}
                    {`  `}
                    <span className="lp-tk-kw">{`const`}</span>
                    {` { text } = `}
                    <span className="lp-tk-kw">{`await`}</span>
                    {` step.`}
                    <span className="lp-tk-fn">{`run`}</span>
                    {`(`}
                    <span className="lp-tk-str">{`"openai.generate"`}</span>
                    {`, () =&gt;`}
                    {"\n"}
                    {`    `}
                    <span className="lp-tk-fn">{`generateText`}</span>
                    {`({ model: `}
                    <span className="lp-tk-fn">{`openai`}</span>
                    {`(`}
                    <span className="lp-tk-str">{`"gpt-4o"`}</span>
                    {`), prompt }),`}
                    {"\n"}
                    {`  );`}
                    {"\n"}
                    {"\n"}
                    {`  `}
                    <span className="lp-tk-kw">{`await`}</span>
                    {` `}
                    <span className="lp-tk-fn">{`publishStatus`}</span>
                    {`(publish, data.id, `}
                    <span className="lp-tk-str">{`"success"`}</span>
                    {`);`}
                    {"\n"}
                    {`  `}
                    <span className="lp-tk-kw">{`return`}</span>
                    {` { ...context, [data.variableName]: { text } };`}
                    {"\n"}
                    {"};"}
                  </code>
                </pre>
              </div>
            </div>
          </Reveal>

          {/* ── FINAL CTA ─────────────────────────────────────── */}
          <Reveal className="lp-section py-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6">
              
              {/* Left Column: Copy & CTA */}
              <div className="lp-cta pr-8 lg:border-r lg:border-gray-800/50">
                <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-wider text-emerald-400 uppercase bg-emerald-900/30 rounded-full">
                  Free to start
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.15] mb-6">
                  Stop duct-taping scripts.<br />
                  Automate it <span className="text-cyan-400">properly.</span>
                </h2>
                
                <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
                  Two workflows, fifty executions a month. No credit card. Build something real before you decide.
                </p>
                
                <div className="lp-cta-buttons">
                  <Button asChild size="lg" className="bg-[#635BFF] hover:bg-indigo-600 text-white font-medium rounded-xl px-6 py-6 text-base">
                    <Link href="/signup" className="flex items-center gap-2">
                      Start building free
                      <ArrowRight  />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Workflow Visualization */}
              <div className="flex flex-col pl-0 lg:pl-8">
                
                {/* Step 1 */}
                <div className="flex items-center justify-between bg-[#15171E] border border-gray-800 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-300 font-medium text-sm">Stripe payment received</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-900/20 rounded-full">done</span>
                </div>

                {/* Connector */}
                <div className="w-px h-5 bg-gray-800 ml-7"></div>

                {/* Step 2 */}
                <div className="flex items-center justify-between bg-[#15171E] border border-gray-800 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-300 font-medium text-sm">OpenAI → summarize order</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-900/20 rounded-full">done</span>
                </div>

                {/* Connector */}
                <div className="w-px h-5 bg-gray-800 ml-7"></div>

                {/* Step 3 (Active) */}
                <div className="flex items-center justify-between bg-[#15171E] border border-gray-800 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    <span className="text-gray-300 font-medium text-sm">Telegram → send notification</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-indigo-300 bg-indigo-900/40 rounded-full">running</span>
                </div>

                {/* Connector */}
                <div className="w-px h-5 bg-gray-800 ml-7"></div>

                {/* Step 4 (Queued) */}
                <div className="flex items-center justify-between bg-[#15171E] border border-gray-800/50 rounded-xl px-5 py-4 opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                    <span className="text-gray-500 font-medium text-sm">Slack → log to #orders</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-gray-500">queued</span>
                </div>

              </div>
            </div>
          </Reveal>
        </main>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <Link href="/" className="lp-nav-logo" style={{ opacity: 0.75 }}>
              <Image
                src="/logos/logo.svg"
                alt="Flowbase"
                width={22}
                height={22}
              />
              <span
                className="lp-display lp-nav-wordmark"
                style={{ fontSize: 14 }}
              >
                flowbase
              </span>
            </Link>
            <div className="lp-footer-right">
              <a
                href="https://github.com/yash00097/flowbase"
                target="_blank"
                rel="noreferrer"
                className="lp-footer-link"
              >
                <IconGithub />
                GitHub
              </a>
              <span className="lp-footer-copy">
                © 2026 · crafted in the open
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────
// Styles (all scoped by the .lp- prefix)
// ────────────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

      .lp-root {
        --bg:         #080a0f;
        --bg-raised:  rgba(255,255,255,0.02);
        --bg-raised-2: rgba(255,255,255,0.035);
        --border:     rgba(255,255,255,0.07);
        --border-strong: rgba(255,255,255,0.14);
        --t-primary:  #ffffff;
        --t-body:     rgba(255,255,255,0.72);
        --t-muted:    rgba(255,255,255,0.55);
        --t-faint:    rgba(255,255,255,0.4);
        --t-dim:      rgba(255,255,255,0.3);
        --indigo:     #6366f1;
        --indigo-soft:#a5b4fc;
        --indigo-deep:#4f46e5;
        --cyan:       #22d3ee;
        --cyan-soft:  #67e8f9;
        --success:    #34d399;
        --danger:     #f87171;
        --ease:       cubic-bezier(0.16, 1, 0.3, 1);

        position: relative;
        min-height: 100dvh;
        background: var(--bg);
        color: var(--t-primary);
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 15px;
        line-height: 1.55;
        -webkit-font-smoothing: antialiased;
        overflow-x: clip;
      }

      .lp-root * { box-sizing: border-box; }

      .lp-display {
        font-family: 'Syne', sans-serif;
        letter-spacing: -0.02em;
      }

      /* ─── Background grid ─────────────────────────── */
      .lp-grid {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background-image:
          linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 20%, #000 30%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 20%, #000 30%, transparent 75%);
      }

      /* ─── Ambient orbs (max 2) ────────────────────── */
      .lp-orb {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        will-change: transform;
      }
      .lp-orb-1 {
        width: 620px; height: 620px;
        top: -180px; right: -120px;
        background: radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 65%);
        animation: lp-float 11s var(--ease) infinite;
      }
      .lp-orb-2 {
        width: 520px; height: 520px;
        bottom: -160px; left: -140px;
        background: radial-gradient(circle, rgba(34,211,238,0.09) 0%, transparent 65%);
        animation: lp-float 14s var(--ease) infinite reverse;
      }
      @keyframes lp-float {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50%      { transform: translate3d(0, -28px, 0) scale(1.04); }
      }

      /* ─── Layout ──────────────────────────────────── */
      .lp-main {
        position: relative;
        z-index: 1;
      }
      .lp-section {
        position: relative;
        max-width: 1180px;
        margin: 0 auto;
        padding: 96px 24px;
      }
      .lp-section-head {
        max-width: 680px;
        margin-bottom: 56px;
      }
      .lp-eyebrow {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--indigo-soft);
        margin-bottom: 18px;
      }
      .lp-h2 {
        font-size: clamp(2.25rem, 4vw, 3.2rem);
        line-height: 1.04;
        font-weight: 700;
        margin: 0 0 18px;
      }
      .lp-accent {
        color: var(--t-muted);
      }
      .lp-section-sub {
        color: var(--t-muted);
        font-size: 1.0625rem;
        line-height: 1.6;
        max-width: 62ch;
        margin: 0;
      }

      /* ─── Reveal ──────────────────────────────────── */
      .lp-reveal {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
      }
      .lp-reveal.in {
        opacity: 1;
        transform: none;
      }

      /* ─── Page-load stagger ───────────────────────── */
      .lp-load {
        opacity: 0;
        transform: translateY(14px);
        animation: lp-pop 0.7s var(--ease) forwards;
        animation-delay: calc(var(--i, 0) * 90ms + 60ms);
      }
      @keyframes lp-pop {
        to { opacity: 1; transform: none; }
      }

      /* ─── Nav ─────────────────────────────────────── */
      .lp-nav {
        position: sticky;
        top: 0;
        z-index: 30;
        width: 100%;
        transition: background 0.3s var(--ease), backdrop-filter 0.3s var(--ease), border-color 0.3s var(--ease);
        border-bottom: 1px solid transparent;
      }
      .lp-nav-scrolled {
        background: rgba(8,10,15,0.62);
        backdrop-filter: saturate(180%) blur(18px);
        -webkit-backdrop-filter: saturate(180%) blur(18px);
        border-bottom-color: var(--border);
      }
      .lp-nav-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 14px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .lp-nav-logo {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--t-primary);
      }
      .lp-nav-wordmark {
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }
      .lp-nav-links {
        display: none;
        align-items: center;
        gap: 28px;
      }
      @media (min-width: 860px) {
        .lp-nav-links { display: inline-flex; }
      }
      .lp-nav-links a {
        font-size: 14px;
        color: var(--t-muted);
        text-decoration: none;
        transition: color .18s;
      }
      .lp-nav-links a:hover { color: var(--t-primary); }
      .lp-nav-cta {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      /* ─── Buttons ────────────────────────────────── */
      .lp-btn-primary,
      .lp-btn-primary:hover {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        color: #fff !important;
        border: 0 !important;
        border-radius: 999px !important;
        padding-left: 18px !important;
        padding-right: 18px !important;
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.16),
          0 8px 32px -6px rgba(99,102,241,0.35) !important;
        transition: box-shadow .28s var(--ease), transform .2s var(--ease) !important;
        font-weight: 600 !important;
      }
      .lp-btn-primary:hover {
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.2),
          0 14px 40px -6px rgba(99,102,241,0.5) !important;
        transform: translateY(-1px);
      }
      .lp-btn-primary:active { transform: translateY(0) scale(0.99); }
      .lp-btn-lg { height: 46px !important; padding-left: 22px !important; padding-right: 22px !important; font-size: 15px !important; }

      .lp-btn-ghost,
      .lp-btn-ghost:hover {
        background: transparent !important;
        color: var(--t-body) !important;
        border: 1px solid var(--border-strong) !important;
        border-radius: 999px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        transition: border-color .18s, color .18s, background .18s !important;
      }
      .lp-btn-ghost:hover {
        color: #fff !important;
        border-color: rgba(255,255,255,0.3) !important;
        background: rgba(255,255,255,0.03) !important;
      }

      /* ─── Hero ───────────────────────────────────── */
      .lp-hero {
        position: relative;
        padding: 112px 24px 64px;
        max-width: 1180px;
        margin: 0 auto;
      }
      .lp-hero-inner { max-width: 920px; }
      .lp-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(99,102,241,0.08);
        border: 1px solid rgba(99,102,241,0.24);
        color: #c7d2fe;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .lp-pill-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--indigo);
        box-shadow: 0 0 0 0 rgba(99,102,241,0.6);
        animation: lp-pulse 2.4s var(--ease) infinite;
      }
      @keyframes lp-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
        50%      { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
      }

      .lp-h1 {
        font-size: clamp(3.25rem, 6.5vw, 5.75rem);
        line-height: 0.96;
        font-weight: 700;
        letter-spacing: -0.045em;
        margin: 24px 0 26px;
        color: var(--t-primary);
      }
      .lp-h1-gradient {
        background: linear-gradient(135deg, #ffffff 0%, #c7d2fe 48%, #a5f3fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
      }
      .lp-hero-sub {
        font-size: 1.125rem;
        color: var(--t-body);
        max-width: 640px;
        margin: 0 0 32px;
        line-height: 1.6;
      }
      .lp-code-inline {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 1px 6px;
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 0.85em;
        color: var(--indigo-soft);
      }
      .lp-hero-cta {
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
        margin-bottom: 56px;
      }
      .lp-link-quiet {
        color: var(--t-body);
        font-size: 14px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
        transition: color .18s, gap .22s var(--ease);
      }
      .lp-link-quiet:hover {
        color: #fff;
        gap: 10px;
      }

      /* ─── Stats (no boxes, 1px dividers) ──────────── */
      .lp-stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-top: 1px solid var(--border);
        margin-top: 12px;
        max-width: 780px;
      }
      .lp-stat {
        padding: 28px 28px 0 0;
        border-left: 1px solid var(--border);
        padding-left: 24px;
      }
      .lp-stat:first-child { border-left: 0; padding-left: 0; }
      .lp-stat-num {
        font-size: clamp(1.75rem, 3vw, 2.375rem);
        font-weight: 700;
        letter-spacing: -0.03em;
        color: var(--indigo-soft);
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
      }
      .lp-stat-pct {
        font-size: 0.7em;
        color: var(--t-faint);
      }
      .lp-stat-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--success);
        margin-left: 6px;
        animation: lp-pulse-green 2.6s var(--ease) infinite;
      }
      @keyframes lp-pulse-green {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.55; transform: scale(0.8); }
      }
      .lp-stat-label {
        margin-top: 6px;
        font-size: 12px;
        color: var(--t-faint);
        letter-spacing: 0.02em;
      }

      /* ─── Demo frame ──────────────────────────────── */
      .lp-demo-frame {
        position: relative;
        border-radius: 18px;
        overflow: visible;
        border: 1px solid var(--border-strong);
        background: rgba(255,255,255,0.015);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 40px 80px -30px rgba(0,0,0,0.65);
      }
      .lp-demo-chrome {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 18px;
        border-bottom: 1px solid var(--border);
        background: rgba(255,255,255,0.015);
      }
      .lp-traffic {
        display: inline-flex; gap: 6px;
      }
      .lp-traffic span {
        width: 11px; height: 11px; border-radius: 50%;
        background: rgba(255,255,255,0.18);
      }
      .lp-traffic span:first-child { background: #ff5f57; }
      .lp-traffic span:nth-child(2) { background: #febc2e; }
      .lp-traffic span:nth-child(3) { background: #28c840; }
      .lp-url {
        flex: 1;
        text-align: center;
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 12px;
        color: var(--t-faint);
        background: rgba(255,255,255,0.03);
        padding: 5px 12px;
        border-radius: 6px;
        border: 1px solid var(--border);
        max-width: 420px;
        margin: 0 auto;
      }
      .lp-chrome-right { min-width: 100px; display: flex; justify-content: flex-end; }
      .lp-chrome-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(52,211,153,0.1);
        border: 1px solid rgba(52,211,153,0.25);
        color: #86efac;
        font-size: 11px;
        font-weight: 600;
      }
      .lp-chrome-pulse {
        width: 6px; height: 6px; border-radius: 50%;
        background: var(--success);
        animation: lp-pulse-green 2s var(--ease) infinite;
      }
      .lp-demo-screen {
        position: relative;
        overflow: hidden;
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
      }
      .lp-demo-img {
        display: block;
        width: 100%;
        height: auto;
      }
      .lp-demo-glow {
        position: absolute;
        inset: -40px -20px -60px -20px;
        z-index: -1;
        pointer-events: none;
        background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(99,102,241,0.22) 0%, rgba(34,211,238,0.06) 50%, transparent 75%);
        filter: blur(14px);
      }

      /* ─── Demo annotations ────────────────────────── */
      .lp-ann {
        position: absolute;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(8,10,15,0.78);
        border: 1px solid var(--border-strong);
        color: #fff;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.01em;
        backdrop-filter: blur(10px);
        box-shadow: 0 6px 18px -6px rgba(0,0,0,0.6);
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
      }
      .lp-ann-dot {
        width: 6px; height: 6px; border-radius: 50%;
      }
      .lp-ann-1 { top: 10%;  right: -6%;  }
      .lp-ann-2 { bottom: 28%; left: -8%;  }
      .lp-ann-3 { bottom: 8%; right: 6%; }
      @media (max-width: 900px) {
        .lp-ann-1 { top: 8%;  right: 4%; }
        .lp-ann-2 { bottom: 24%; left: 4%; }
        .lp-ann-3 { bottom: 6%; right: 4%; }
      }

      /* ─── How it works ───────────────────────────── */
      .lp-how-row {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 32px;
      }
      @media (max-width: 820px) {
        .lp-how-row { grid-template-columns: 1fr; }
        .lp-how-line { display: none; }
      }
      .lp-how-line {
        position: absolute;
        top: 38px;
        left: 0; right: 0;
        width: 100%;
        height: 80px;
        pointer-events: none;
      }
      .lp-step {
        position: relative;
        padding-top: 8px;
      }
      .lp-step-icon {
        position: relative;
        width: 76px;
        height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
        margin-bottom: 24px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      }
      .lp-step-num {
        position: absolute;
        top: -10px; right: -10px;
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: 11px;
        color: var(--indigo-soft);
        background: var(--bg);
        padding: 3px 8px;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
      }
      .lp-step-title {
        font-size: 1.375rem;
        font-weight: 600;
        margin: 0 0 10px;
        color: var(--t-primary);
        letter-spacing: -0.02em;
      }
      .lp-step-copy {
        color: var(--t-muted);
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
      }

      /* ─── Node library ────────────────────────────── */
      .lp-node-groups {
        display: grid;
        gap: 48px;
      }
      .lp-node-group-head {
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding-bottom: 12px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border);
      }
      .lp-node-group-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--t-body);
      }
      .lp-node-group-count {
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 11px;
        color: var(--t-faint);
      }
      .lp-node-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
      }
      @media (max-width: 780px) { .lp-node-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 520px) { .lp-node-grid { grid-template-columns: repeat(2, 1fr); } }

      .lp-node-chip {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 20px 16px 18px;
        border-radius: 14px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        transition: transform .22s var(--ease), border-color .22s, box-shadow .22s;
        animation: lp-chip-in 0.5s var(--ease) both;
        animation-delay: calc(var(--i, 0) * 50ms);
      }
      @keyframes lp-chip-in {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: none; }
      }
      .lp-node-chip:hover {
        transform: translateY(-3px);
        border-color: var(--accent);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent),
          0 20px 40px -24px color-mix(in srgb, var(--accent) 50%, transparent);
      }
      .lp-node-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--border);
      }
      .lp-node-logo img { filter: none; }
      .lp-node-name {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--t-body);
        letter-spacing: 0.01em;
      }

      .lp-roadmap {
        margin-top: 56px;
        padding-top: 28px;
        border-top: 1px dashed var(--border);
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
      }
      .lp-roadmap-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--cyan-soft);
      }
      .lp-roadmap-items {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .lp-roadmap-chip {
        font-size: 12px;
        color: var(--t-muted);
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(34,211,238,0.04);
        border: 1px dashed rgba(34,211,238,0.22);
      }

      /* ─── Bento ───────────────────────────────────── */
      .lp-bento {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: auto auto;
        gap: 18px;
      }
      @media (max-width: 820px) {
        .lp-bento { grid-template-columns: 1fr; }
      }
      .lp-bento-card {
        position: relative;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 32px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        transition: transform .3s var(--ease), border-color .3s;
        overflow: hidden;
      }
      .lp-bento-card:hover {
        transform: translateY(-2px);
        border-color: var(--border-strong);
      }
      .lp-bento-wide { grid-column: span 1; }
      .lp-bento-tall { grid-row: span 1; }
      .lp-bento-full { grid-column: span 2; }
      @media (max-width: 820px) {
        .lp-bento-full { grid-column: span 1; }
      }
      .lp-bento-head {
        display: flex;
        gap: 18px;
        align-items: flex-start;
        margin-bottom: 26px;
      }
      .lp-bento-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.04);
        border: 1px solid var(--border);
        flex-shrink: 0;
      }
      .lp-bento-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 6px;
        letter-spacing: -0.02em;
      }
      .lp-bento-sub {
        color: var(--t-muted);
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }

      /* mini node-status mock */
      .lp-nodes-mock {
        display: grid;
        gap: 8px;
        margin-top: 18px;
      }
      .lp-node-row {
        display: grid;
        grid-template-columns: 12px 1fr auto;
        gap: 14px;
        align-items: center;
        padding: 12px 16px;
        border-radius: 10px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 13px;
      }
      .lp-node-row-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(255,255,255,0.25);
      }
      .lp-node-row-name { color: var(--t-body); }
      .lp-node-row-state {
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--t-faint);
      }
      .lp-state-done .lp-node-row-dot { background: var(--success); }
      .lp-state-done .lp-node-row-state { color: #86efac; }
      .lp-state-running .lp-node-row-dot {
        background: var(--cyan);
        animation: lp-pulse-green 1.4s var(--ease) infinite;
      }
      .lp-state-running .lp-node-row-state { color: var(--cyan-soft); }
      .lp-state-running {
        border-color: rgba(34,211,238,0.28);
        background: rgba(34,211,238,0.04);
      }
      .lp-state-queued .lp-node-row-dot { background: rgba(255,255,255,0.2); }

      /* branch viz */
      .lp-branch-viz {
        width: 100%;
        height: auto;
        margin-top: 20px;
        display: block;
      }

      /* template flow */
      .lp-tmpl-flow {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 20px;
        margin-top: 18px;
      }
      @media (max-width: 720px) {
        .lp-tmpl-flow { grid-template-columns: 1fr; }
        .lp-tmpl-arrow { transform: rotate(90deg); justify-self: center; }
      }
      .lp-tmpl-box {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px 18px;
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 13px;
      }
      .lp-tmpl-label {
        color: var(--indigo-soft);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 10px;
      }
      .lp-tmpl-code { color: var(--t-body); line-height: 1.7; }
      .lp-tmpl-arrow { display: flex; align-items: center; justify-content: center; }

      /* syntax tokens */
      .lp-tk-kw  { color: #c4b5fd; }
      .lp-tk-str { color: #86efac; }
      .lp-tk-fn  { color: #7dd3fc; }
      .lp-tk-com { color: rgba(255,255,255,0.35); font-style: italic; }
      .lp-tk-var { color: #fcd34d; }

      /* ─── Open-source ─────────────────────────────── */
      .lp-os-grid {
        display: grid;
        grid-template-columns: 5fr 7fr;
        gap: 56px;
        align-items: center;
      }
      @media (max-width: 900px) {
        .lp-os-grid { grid-template-columns: 1fr; gap: 32px; }
      }
      .lp-os-copy .lp-h2 { margin-top: 16px; }
      .lp-os-list {
        list-style: none;
        padding: 0;
        margin: 28px 0 32px;
        display: grid;
        gap: 12px;
        color: var(--t-muted);
        font-size: 14.5px;
      }
      .lp-os-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        line-height: 1.5;
      }
      .lp-os-list code {
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        background: rgba(255,255,255,0.05);
        padding: 1px 6px;
        border-radius: 5px;
        font-size: 0.9em;
        color: var(--indigo-soft);
      }
      .lp-os-tick {
        flex-shrink: 0;
        width: 16px; height: 16px;
        margin-top: 3px;
        border-radius: 50%;
        background:
          radial-gradient(circle at center, rgba(99,102,241,0.25) 0%, transparent 70%),
          rgba(99,102,241,0.1);
        border: 1px solid rgba(99,102,241,0.4);
        position: relative;
      }
      .lp-os-tick::after {
        content: '';
        position: absolute;
        inset: 4px 3px 4px 3px;
        border-left: 1.5px solid var(--indigo-soft);
        border-bottom: 1.5px solid var(--indigo-soft);
        transform: rotate(-45deg) translate(1px, -1px);
        border-radius: 1px;
      }
      .lp-os-cta { display: flex; gap: 10px; }

      /* code block */
      .lp-code {
        position: relative;
        border-radius: 14px;
        border: 1px solid var(--border-strong);
        background: rgba(255,255,255,0.02);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.05),
          0 30px 60px -30px rgba(0,0,0,0.7);
        overflow: hidden;
      }
      .lp-code-tab {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        background: rgba(255,255,255,0.03);
        border-bottom: 1px solid var(--border);
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 12px;
        color: var(--t-faint);
        width: 100%;
      }
      .lp-code-tab-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        background: var(--indigo-soft);
      }
      .lp-code-block {
        margin: 0;
        padding: 22px 24px;
        font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
        font-size: 13px;
        line-height: 1.7;
        color: var(--t-body);
        overflow-x: auto;
        white-space: pre;
      }

      /* ─── CTA ─────────────────────────────────────── */
      .lp-cta-sec { padding-bottom: 128px; }
      .lp-cta {
        position: relative;
        padding: 80px 40px;
        text-align: center;
        border-radius: 24px;
        background: rgba(255,255,255,0.015);
        border: 1px solid var(--border);
        overflow: hidden;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      }
      .lp-cta-haze {
        position: absolute;
        top: -30%; left: 50%;
        width: 720px;
        height: 440px;
        transform: translateX(-50%);
        background: radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, rgba(34,211,238,0.06) 45%, transparent 72%);
        pointer-events: none;
        z-index: 0;
      }
      .lp-cta > * { position: relative; z-index: 1; }
      .lp-cta .lp-eyebrow { color: var(--cyan-soft); }
      .lp-cta-h2 {
        margin-top: 14px;
        font-size: clamp(2.25rem, 4.5vw, 3.5rem);
      }
      .lp-cta-sub {
        margin: 0 auto 32px;
        max-width: 52ch;
      }
      .lp-cta-buttons {
        display: inline-flex;
        gap: 14px;
        flex-wrap: wrap;
        justify-content: center;
      }

      /* ─── Footer ──────────────────────────────────── */
      .lp-footer {
        border-top: 1px solid var(--border);
        position: relative;
        z-index: 1;
      }
      .lp-footer-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 28px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        flex-wrap: wrap;
      }
      .lp-footer-right {
        display: inline-flex;
        align-items: center;
        gap: 20px;
      }
      .lp-footer-link {
        color: var(--t-muted);
        font-size: 13px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: color .2s;
      }
      .lp-footer-link:hover { color: #fff; }
      .lp-footer-copy {
        font-size: 12px;
        color: var(--t-dim);
      }

      /* ─── Scrollbar ───────────────────────────────── */
      .lp-root ::-webkit-scrollbar { width: 8px; }
      .lp-root ::-webkit-scrollbar-track { background: transparent; }
      .lp-root ::-webkit-scrollbar-thumb {
        background: rgba(99,102,241,0.35);
        border-radius: 4px;
      }

      /* reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lp-root *,
        .lp-root *::before,
        .lp-root *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}
