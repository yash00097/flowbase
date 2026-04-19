"use client";

import { useState } from "react";
import { useReveal } from "./use-reveal";

export function CodePreview() {
  const [tab, setTab] = useState<"json" | "ts">("ts");
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative text-[color:var(--fb-ink)]">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-26">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="fb-mono mb-5 text-[11.5px] uppercase tracking-[0.18em] text-[color:var(--fb-ink-muted)]">
              The shape of a workflow
            </p>
            <h2 className="fb-display max-w-[22ch] text-[clamp(36px,5vw,56px)] font-[700] leading-[1.05] text-[color:var(--fb-ink)]">
              Every canvas is a value
              <br />
              your editor already understands.
            </h2>
          </div>
          <div
            role="tablist"
            aria-label="Workflow preview format"
            className="inline-flex rounded-full border border-[color:var(--fb-rule)] p-1 text-[12.5px]"
          >
            {(["ts", "json"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
                className={`fb-mono rounded-full px-4 py-1.5 uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fb-accent)] ${
                  tab === t
                    ? "bg-[color:var(--fb-accent)] text-[color:var(--fb-paper)]"
                    : "text-[color:var(--fb-ink-muted)] hover:text-[color:var(--fb-ink)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={ref}
          className="fb-reveal overflow-hidden rounded-[14px] border border-[color:var(--fb-rule)]"
        >
          <div className="flex items-center gap-3 border-b border-[color:var(--fb-rule)] bg-[color:var(--fb-paper-2)] px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--fb-rule)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--fb-rule)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--fb-rule)]" />
            <span className="fb-mono ml-2 text-[11.5px] text-[color:var(--fb-ink-muted)]">
              workflows/lead-router.{tab}
            </span>
          </div>
          <div className="overflow-x-auto">
            {tab === "ts" ? <TsSnippet /> : <JsonSnippet />}
          </div>
        </div>
      </div>
    </section>
  );
}

function TsSnippet() {
  return (
    <pre className="fb-mono m-0 whitespace-pre bg-[color:var(--fb-paper-2)] p-6 text-[13px] leading-[1.75] text-[color:var(--fb-ink-soft)] md:p-8 md:text-[14px]">
      <code>
        <C k="keyword">import</C> {"{ defineWorkflow }"} <C k="keyword">from</C>{" "}
        <C k="string">"flowbase"</C>
        {";\n\n"}
        <C k="keyword">export default</C> <C k="fn">defineWorkflow</C>(
        {"(w) => ({\n"}
        {"  name: "}
        <C k="string">"stripe → slack router"</C>
        {",\n"}
        {"  trigger: w."}
        <C k="fn">webhook</C>({"{ path: "}
        <C k="string">"/hook/stripe"</C>
        {", verify: w.env."}
        <C k="accent">STRIPE_SECRET</C>
        {" }),\n\n"}
        {"  nodes: {\n"}
        {"    intent: w."}
        <C k="fn">ai</C>({"{\n"}
        {"      model: "}
        <C k="string">"sonnet-4"</C>
        {",\n"}
        {"      input: "}
        <C k="accent">"$trigger.body.description"</C>
        {",\n"}
        {"      schema: w.z."}
        <C k="fn">object</C>({"{ category: w.z."}
        <C k="fn">enum</C>({"["}
        <C k="string">"lead"</C>
        {", "}
        <C k="string">"support"</C>
        {", "}
        <C k="string">"spam"</C>
        {"] })},\n"}
        {"    }),\n\n"}
        {"    route: w."}
        <C k="fn">branch</C>({"("}
        <C k="accent">$intent</C>
        {".category, {\n"}
        {"      lead: w."}
        <C k="fn">slack</C>({"{ channel: "}
        <C k="string">"#sales"</C>
        {", text: "}
        {/* biome-ignore lint/suspicious/noTemplateCurlyInString: code sample */}
        <C k="accent">{"`new lead: ${$trigger.body.email}`"}</C>
        {" }),\n"}
        {"      support: w."}
        <C k="fn">gmail</C>({"{ to: "}
        <C k="string">"support@acme.co"</C>
        {" }),\n"}
        {"      spam: w."}
        <C k="fn">drop</C>(){",\n    }),\n"}
        {"  },\n"}
        {"}))"}
      </code>
    </pre>
  );
}

function JsonSnippet() {
  return (
    <pre className="fb-mono m-0 whitespace-pre bg-[color:var(--fb-paper-2)] p-6 text-[13px] leading-[1.75] text-[color:var(--fb-ink-soft)] md:p-8 md:text-[14px]">
      <code>
        {`{
  "name": `}
        <C k="string">"stripe → slack router"</C>
        {`,
  "trigger": { "kind": `}
        <C k="string">"webhook"</C>
        {`, "path": `}
        <C k="string">"/hook/stripe"</C>
        {` },
  "nodes": [
    { "id": `}
        <C k="accent">"intent"</C>
        {`, "kind": `}
        <C k="string">"ai.anthropic"</C>
        {`, "model": `}
        <C k="string">"sonnet-4"</C>
        {` },
    { "id": `}
        <C k="accent">"route"</C>
        {`,  "kind": `}
        <C k="string">"logic.branch"</C>
        {`, "on": `}
        <C k="accent">"$intent.category"</C>
        {` },
    { "id": `}
        <C k="accent">"notify"</C>
        {`, "kind": `}
        <C k="string">"slack.message"</C>
        {`, "channel": `}
        <C k="string">"#sales"</C>
        {` }
  ]
}`}
      </code>
    </pre>
  );
}

function C({
  k,
  children,
}: {
  k: "keyword" | "string" | "fn" | "accent";
  children: React.ReactNode;
}) {
  const color =
    k === "keyword"
      ? "var(--fb-accent-ink)"
      : k === "string"
        ? "oklch(0.82 0.09 150)"
        : k === "fn"
          ? "oklch(0.85 0.1 75)"
          : "var(--fb-ink)";
  return <span style={{ color }}>{children}</span>;
}
