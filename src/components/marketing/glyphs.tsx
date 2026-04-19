export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <title>Flowbase</title>
      <rect x={2} y={4} width={8} height={8} rx={2} fill="var(--fb-ink)" />
      <rect x={14} y={12} width={8} height={8} rx={2} fill="var(--fb-accent)" />
      <path
        d="M 10 8 C 14 8, 10 16, 14 16"
        stroke="var(--fb-ink)"
        strokeWidth={1.6}
        fill="none"
      />
    </svg>
  );
}

export function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <title>GitHub</title>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.3-.52-1.47.11-3.06 0 0 .98-.32 3.2 1.18a11.1 11.1 0 0 1 5.84 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.07.78 2.15v3.19c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
