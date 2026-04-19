import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-14 md:flex-row md:items-end md:justify-between md:px-10 md:py-16">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--fb-accent)] rounded-sm"
          >
            <Image src="/logos/logo.svg" alt="Flowbase" width={32} height={32}/>
            <span className="fb-display text-[20px] font-[700] tracking-[-0.01em]">
              Flowbase
            </span>
          </Link>
          <p className="fb-mono mt-3 text-[12px] text-[color:var(--fb-ink-muted)]">
            © {year} · MIT · Built for people who ship.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[14px] text-[color:var(--fb-ink-soft)]">
          <Link
            href="/workflows"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
          >
            Product
          </Link>
          <Link
            href="https://github.com/yash00097/flowbase#readme"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/yash00097/flowbase"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
          <Link
            href="https://github.com/yash00097/flowbase/releases"
            className="hover:text-[color:var(--fb-ink)] transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Changelog
          </Link>
        </nav>
      </div>
    </footer>
  );
}
