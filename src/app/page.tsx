import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";

const featureCards = [
  {
    title: "Visual Workflow Builder",
    description:
      "Build automations in a visual editor and move from idea to production quickly without giving up control.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="15" y="3" width="6" height="6" rx="1.5" />
        <rect x="9" y="15" width="6" height="6" rx="1.5" />
        <path d="M6 9v3a3 3 0 003 3h6a3 3 0 003-3V9" />
      </svg>
    ),
    accent: "#6366f1",
  },
  {
    title: "Code When You Need It",
    description:
      "Use JavaScript, API calls, and custom logic in the same workflow when low-code blocks are not enough.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    accent: "#22d3ee",
  },
  {
    title: "App & AI Integrations",
    description:
      "Connect your stack, trigger flows from events, and orchestrate app and AI tasks in one place.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.636-6.364-2.122 2.122M8.757 15.243l-2.121 2.121M17.364 17.364l-2.121-2.121M8.757 8.757 6.636 6.636" />
      </svg>
    ),
    accent: "#a78bfa",
  },
];

const useCases = [
  { text: "Sync data between SaaS tools and internal systems.", num: "01" },
  { text: "Run lead routing, notifications, and follow-up automations.", num: "02" },
  { text: "Automate support triage, handoffs, and response workflows.", num: "03" },
  { text: "Build AI-powered assistants and multi-step processing flows.", num: "04" },
];

const principles = [
  { text: "Fast visual editing for non-stop iteration.", icon: "⚡" },
  { text: "Developer flexibility with script and API support.", icon: "🔧" },
  { text: "Secure execution with reliability for production workloads.", icon: "🛡" },
];

const stats = [
  { value: "10x", label: "Faster automation" },
  { value: "500+", label: "Integrations" },
  { value: "99.9%", label: "Uptime SLA" },
];

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/workflows");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .fb-root {
          font-family: 'DM Sans', sans-serif;
        }
        .fb-display {
          font-family: 'Syne', sans-serif;
        }

        /* Grid background */
        .fb-grid-bg {
          background-color: #080a0f;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Glow orbs */
        .fb-orb-1 {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          top: -200px;
          right: -150px;
          pointer-events: none;
          z-index: 0;
          animation: fb-float 8s ease-in-out infinite;
        }
        .fb-orb-2 {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
          z-index: 0;
          animation: fb-float 10s ease-in-out infinite reverse;
        }

        @keyframes fb-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Entrance animations */
        @keyframes fb-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fb-slide-right {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .fb-animate-1 { animation: fb-fade-up 0.6s cubic-bezier(.16,1,.3,1) both; }
        .fb-animate-2 { animation: fb-fade-up 0.6s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .fb-animate-3 { animation: fb-fade-up 0.6s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .fb-animate-4 { animation: fb-fade-up 0.6s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .fb-animate-5 { animation: fb-fade-up 0.6s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .fb-animate-6 { animation: fb-fade-in 0.8s ease 0.5s both; }

        /* Feature card hover */
        .fb-feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }
        .fb-feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-glow, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .fb-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.15);
        }
        .fb-feature-card:hover::before {
          opacity: 1;
        }

        /* Icon glow */
        .fb-icon-wrap {
          transition: filter 0.25s ease, transform 0.25s ease;
        }
        .fb-feature-card:hover .fb-icon-wrap {
          filter: drop-shadow(0 0 12px var(--icon-color, #6366f1));
          transform: scale(1.1);
        }

        /* Gradient text */
        .fb-gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Pill badge */
        .fb-pill {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .fb-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: fb-pulse 2s ease infinite;
        }
        @keyframes fb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Stat cards */
        .fb-stat {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 20px 24px;
          text-align: center;
          transition: border-color 0.2s;
        }
        .fb-stat:hover {
          border-color: rgba(99,102,241,0.3);
        }

        /* Use case rows */
        .fb-usecase {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: padding-left 0.2s ease;
          cursor: default;
        }
        .fb-usecase:last-child { border-bottom: none; }
        .fb-usecase:hover { padding-left: 6px; }
        .fb-usecase-num {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          color: #6366f1;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding-top: 2px;
          flex-shrink: 0;
        }

        /* Principle rows */
        .fb-principle {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s, border-color 0.2s;
          cursor: default;
        }
        .fb-principle:hover {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.2);
        }

        /* Glow button */
        .fb-btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
          box-shadow: 0 0 0 0 rgba(99,102,241,0.5);
          transition: box-shadow 0.3s ease, transform 0.2s ease !important;
          position: relative;
          overflow: hidden;
        }
        .fb-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .fb-btn-primary:hover {
          box-shadow: 0 0 24px 4px rgba(99,102,241,0.4) !important;
          transform: translateY(-1px) !important;
        }
        .fb-btn-primary:hover::after { opacity: 1; }

        .fb-btn-outline {
          border-color: rgba(255,255,255,0.15) !important;
          color: rgba(255,255,255,0.75) !important;
          transition: border-color 0.2s, color 0.2s, background 0.2s !important;
        }
        .fb-btn-outline:hover {
          border-color: rgba(255,255,255,0.4) !important;
          color: #fff !important;
          background: rgba(255,255,255,0.05) !important;
        }

        /* Nav */
        .fb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          margin-bottom: 8px;
        }

        /* CTA section */
        .fb-cta {
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(34,211,238,0.05) 100%);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          padding: 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .fb-cta::before {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Flowing connector line decorations */
        .fb-connector {
          position: absolute;
          opacity: 0.15;
          pointer-events: none;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
      `}</style>

      <div className="fb-root fb-grid-bg min-h-screen text-white relative">
        {/* Background orbs */}
        <div className="fb-orb-1" />
        <div className="fb-orb-2" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

          {/* ── Nav ── */}
          <nav className="fb-nav fb-animate-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/logo.svg"
                alt="Flowbase"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="fb-display text-lg font-700 text-white tracking-tight" style={{ fontWeight: 700 }}>
                flowbase
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="fb-btn-outline rounded-lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="fb-btn-primary rounded-lg px-5">
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </nav>

          {/* ── Hero ── */}
          <section className="pt-12 pb-16 md:pt-20 md:pb-24">
            <div className="fb-animate-2 mb-6">
              <span className="fb-pill">
                <span className="fb-pill-dot" />
                Workflow Automation Platform
              </span>
            </div>

            <h1
              className="fb-display fb-gradient-text fb-animate-3 mb-6 max-w-4xl text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ fontWeight: 800 }}
            >
              Build automations at the speed of thought.
            </h1>

            <p className="fb-animate-4 mb-10 max-w-2xl text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Flowbase is a workflow automation platform inspired by modern node-based tools.
              Design, run, and monitor business-critical automations across apps, APIs, and AI services — from one workspace.
            </p>

            <div className="fb-animate-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="fb-btn-primary rounded-xl px-8 text-base">
                <Link href="/signup">Start building free →</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="fb-animate-6 mt-14 grid grid-cols-3 gap-4 max-w-lg">
              {stats.map((s) => (
                <div key={s.label} className="fb-stat">
                  <div className="fb-display text-2xl font-bold" style={{ color: '#a5b4fc', fontWeight: 800 }}>
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Feature Cards ── */}
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="fb-display text-2xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
                Everything you need to automate
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                From visual builders to raw code — Flowbase adapts to how you work.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((item, i) => (
                <div
                  key={item.title}
                  className="fb-feature-card rounded-2xl p-6"
                  style={{
                    '--card-glow': `radial-gradient(circle at top left, ${item.accent}08, transparent 60%)`,
                    '--icon-color': item.accent,
                    animationDelay: `${0.5 + i * 0.1}s`,
                  } as React.CSSProperties}
                >
                  <div
                    className="fb-icon-wrap mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${item.accent}18`, color: item.accent }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="fb-display mb-2 text-base font-semibold text-white" style={{ fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Why Flowbase ── */}
          <section className="mb-16">
            <div
              className="rounded-2xl p-8 md:p-10"
              style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="mb-8">
                <h2 className="fb-display mb-2 text-2xl font-bold text-white" style={{ fontWeight: 700 }}>
                  Why teams choose Flowbase
                </h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Operations, sales, support, and engineering teams trust Flowbase to automate repetitive work.
                </p>
              </div>

              <div className="grid gap-10 lg:grid-cols-2">
                {/* Use cases */}
                <div>
                  <h3 className="fb-display mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: '#6366f1' }}>
                    Common Workflows
                  </h3>
                  <div>
                    {useCases.map((item) => (
                      <div key={item.num} className="fb-usecase">
                        <span className="fb-usecase-num">{item.num}</span>
                        <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Principles */}
                <div>
                  <h3 className="fb-display mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: '#22d3ee' }}>
                    Platform Principles
                  </h3>
                  <div className="flex flex-col gap-3">
                    {principles.map((item) => (
                      <div key={item.text} className="fb-principle">
                        <span className="text-base shrink-0">{item.icon}</span>
                        <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="mb-12">
            <div className="fb-cta">
              <div className="mb-4">
                <Image
                  src="/logos/logo.svg"
                  alt="Flowbase"
                  width={48}
                  height={48}
                  className="mx-auto mb-4 rounded-xl"
                />
              </div>
              <h2 className="fb-display fb-gradient-text mb-3 text-3xl md:text-4xl" style={{ fontWeight: 800 }}>
                Ready to automate your workflows?
              </h2>
              <p className="mb-8 text-sm md:text-base max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
                From first automation to production-grade orchestration — Flowbase grows with you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="fb-btn-primary rounded-xl px-10 text-base">
                  <Link href="/signup">Create free account</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer>
            <Separator style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-2">
                <Image src="/logos/logo.svg" alt="Flowbase" width={20} height={20} className="opacity-60" />
                <span className="fb-display text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  flowbase
                </span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Authenticated users are redirected to{' '}
                <code style={{ color: 'rgba(99,102,241,0.8)', fontFamily: 'monospace' }}>/workflows</code>
              </p>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
};

export default Page;
