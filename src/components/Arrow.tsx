import { cn } from '@/lib/utils'

/** Seta desenhada à mão. `out` = link que sai do site. */
export function Arrow({ out = false, className }: { out?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('inline-block h-[0.9em] w-[0.9em] shrink-0', out && '-rotate-45', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 12.4 C 8 12, 14 11.8, 20 12 M 14 6 L 20.5 12 L 14 18.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Texto acessível para links que abrem em nova aba. */
export function NewTab() {
  return <span className="sr-only"> (abre em nova aba)</span>
}
