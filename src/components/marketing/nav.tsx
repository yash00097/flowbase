import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--fb-rule)]/60 bg-[color:var(--fb-paper)]/85 backdrop-blur-[6px]">
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--fb-accent)] rounded-sm"
          aria-label="Flowbase home"
        >
          <Image src="/logos/logo.svg" alt="Flowbase" width={32} height={32}/>
          <span className="fb-display text-[17px] font-[700] tracking-[-0.01em]">
            Flowbase
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] text-[color:var(--fb-ink-soft)] md:flex">
          <Link
            href="#capabilities"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
          >
            Capabilities
          </Link>
          <Link
            href="#how"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#integrations"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
          >
            Integrations
          </Link>
          <Link
            href="https://github.com/yash00097/flowbase"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
          >
            GitHub
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-1.5 text-[14px] text-[color:var(--fb-ink-soft)] hover:text-[color:var(--fb-ink)] transition-colors md:inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fb-accent)]"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[color:var(--fb-accent)] px-4 text-[13.5px] font-[500] text-[color:var(--fb-paper)] transition-transform duration-200 ease-[var(--fb-ease-out)] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--fb-accent)]"
          >
            Try Flowbase
          </Link>
        </div>
      </div>
    </header>
  );
}
