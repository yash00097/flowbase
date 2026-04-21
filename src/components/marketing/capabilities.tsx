"use client";

import {
  Braces,
  GitBranch,
  LineChart,
  Radio,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useReveal } from "./use-reveal";

type Capability = {
  label: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  span: "lg" | "md" | "sm";
  visual?: "flow" | "code" | "log";
};

const capabilities: Capability[] = [
  {
    label: "Canvas",
    title: "A canvas that keeps up with your thinking.",
    body: "Drag, connect, branch. Edges carry typed payloads between nodes so you never wonder what a handle emits.",
    icon: Workflow,
    span: "lg",
    visual: "flow",
  },
  {
    label: "Runtime",
    title: "Durable runs on Inngest.",
    body: "Topological execution. Retries, step memoization, and replay — without you writing a scheduler.",
    icon: GitBranch,
    span: "sm",
  },
  {
    label: "Observability",
    title: "Logs that look like dev tools.",
    body: "Every node publishes realtime status. Timing, payloads, errors — streamed into the editor as it runs.",
    icon: LineChart,
    span: "md",
    visual: "log",
  },
  {
    label: "Triggers",
    title: "Webhooks, forms, payments, manual.",
    body: "Bring any event. Sign it, template the response, route the payload — no glue services required.",
    icon: Radio,
    span: "sm",
  },
  {
    label: "AI nodes",
    title: "Claude, GPT, Gemini. First-class.",
    body: "Chain prompts with typed variables. Handlebars for templating. Stream outputs into downstream nodes.",
    icon: Braces,
    span: "md",
    visual: "code",
  },
  {
    label: "Credentials",
    title: "Keys encrypted at rest.",
    body: "AES via Cryptr. Scoped per user, selected per node. Never expose secrets to the browser.",
    icon: ShieldCheck,
    span: "sm",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-26">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="fb-mono mb-5 flex items-center gap-3 text-[12px] text-[color:var(--fb-ink-muted)]">
              <span className="fb-tnum">02</span>
              <span aria-hidden="true" className="h-px w-6 bg-[color:var(--fb-rule)]" />
              Capabilities
            </p>
            <h2 className="fb-display max-w-[18ch] text-[clamp(38px,5.5vw,64px)] font-[700] leading-[1.02] text-[color:var(--fb-ink)]">
              A small set of primitives.
              <br />
              <span className="italic text-[color:var(--fb-accent-ink)]">
                Nothing you'll outgrow.
              </span>
            </h2>
          </div>
          <p className="max-w-[44ch] text-[16px] leading-[1.6] text-[color:var(--fb-ink-soft)]">
            Flowbase ships the smallest surface area that runs real production
            automations. Add a node when the job demands one — not because the
            UI had an empty slot.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.label} cap={cap} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ cap, index }: { cap: Capability; index: number }) {
  const ref = useReveal<HTMLDivElement>();
  const spanClass =
    cap.span === "lg"
      ? "md:col-span-4 md:row-span-2"
      : cap.span === "md"
        ? "md:col-span-3"
        : "md:col-span-2";
  const Icon = cap.icon;
  return (
    <article
      ref={ref}
      className={`fb-reveal group relative flex flex-col gap-6 rounded-[14px] border border-[color:var(--fb-rule)] bg-[color:var(--fb-paper-2)]/60 p-7 transition-colors duration-300 hover:bg-[color:var(--fb-paper-2)] md:p-9 ${spanClass}`}
      style={{ "--fb-stagger": index } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[color:var(--fb-ink-soft)]" />
        <p className="fb-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--fb-ink-muted)]">
          {cap.label}
        </p>
      </div>
      <div className="flex-1">
        <h3 className="fb-display text-[clamp(22px,2.4vw,30px)] font-[500] leading-[1.08] tracking-[-0.01em] text-[color:var(--fb-ink)]">
          {cap.title}
        </h3>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.6] text-[color:var(--fb-ink-soft)]">
          {cap.body}
        </p>
      </div>
      {cap.visual && <CapabilityVisual kind={cap.visual} />}
    </article>
  );
}

function CapabilityVisual({
  kind,
}: {
  kind: NonNullable<Capability["visual"]>;
}) {
  if (kind === "flow") {
    return (
      <svg
        viewBox="0 0 520 160"
        className="h-auto w-full text-[color:var(--fb-ink-soft)]"
        aria-hidden="true"
      >
        <title>Flow routing diagram</title>
        <g fill="none" stroke="currentColor" strokeWidth={1.2} opacity={0.5}>
          <path d="M 70 80 L 150 80" />
          <path d="M 210 80 C 250 80, 260 40, 295 40" />
          <path
            d="M 210 80 C 250 80, 260 120, 295 120"
            className="fb-edge-flow"
            stroke="var(--fb-accent)"
            strokeWidth={1.6}
          />
          <path d="M 375 40 L 420 40" />
          <path d="M 355 120 L 420 120" />
        </g>
        {[
          { x: 10, y: 66, label: "trigger", w: 60 },
          { x: 150, y: 66, label: "route", w: 60 },
          { x: 295, y: 26, label: "ai · sonnet", w: 80 },
          { x: 295, y: 106, label: "http", w: 60 },
          { x: 420, y: 26, label: "slack", w: 60 },
          { x: 420, y: 106, label: "notion", w: 60 },
        ].map((n) => (
          <g key={n.label}>
            <rect
              x={n.x}
              y={n.y}
              rx={8}
              ry={8}
              width={n.w}
              height={28}
              fill="var(--fb-paper)"
              stroke="var(--fb-rule)"
            />
            <text
              x={n.x + 8}
              y={n.y + 18}
              fontFamily="var(--fb-font-mono)"
              fontSize={9}
              fill="var(--fb-ink-soft)"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "code") {
    return (
      <pre className="fb-mono overflow-hidden rounded-[10px] border border-[color:var(--fb-rule)] bg-[color:var(--fb-paper)] p-4 text-[12.5px] leading-[1.7] text-[color:var(--fb-ink-soft)]">
        <code>
          <span className="text-[color:var(--fb-accent-ink)]">ai</span>
          {".prompt({ model: "}
          <span className="text-[color:var(--fb-ink)]">"sonnet-4"</span>
          {", input: "}
          <br />
          {"  "}
          <span className="text-[color:var(--fb-accent-ink)]">$trigger</span>
          {".body.message "}
          <br />
          {"}) →  "}
          <span className="text-[color:var(--fb-accent-ink)]">$intent</span>
        </code>
      </pre>
    );
  }
  if (kind === "log") {
    const rows: Array<{
      t: string;
      node: string;
      status: "ok" | "run" | "retry";
      ms: string;
    }> = [
      { t: "14:02:11.204", node: "trigger", status: "ok", ms: "8ms" },
      { t: "14:02:11.212", node: "ai.intent", status: "ok", ms: "612ms" },
      { t: "14:02:11.824", node: "branch", status: "ok", ms: "2ms" },
      { t: "14:02:11.827", node: "slack.send", status: "run", ms: "—" },
    ];
    const dot = {
      ok: "var(--fb-live)",
      run: "var(--fb-accent)",
      retry: "oklch(0.72 0.17 55)",
    };
    return (
      <pre
        className="fb-mono overflow-hidden rounded-[10px] border border-[color:var(--fb-rule)] bg-[color:var(--fb-paper)] p-4 text-[12px] leading-[1.7] text-[color:var(--fb-ink-soft)]"
        aria-hidden="true"
      >
        {rows.map((r) => (
          <div key={r.node} className="flex items-center gap-3">
            <span className="text-[color:var(--fb-ink-muted)]">{r.t}</span>
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: dot[r.status] }}
            />
            <span className="text-[color:var(--fb-ink)]">{r.node}</span>
            <span className="text-[color:var(--fb-ink-muted)]">{r.ms}</span>
          </div>
        ))}
      </pre>
    );
  }
  return null;
}
