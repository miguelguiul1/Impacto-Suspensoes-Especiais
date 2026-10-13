import type { ReactNode } from 'react'
import { PROPOSAL_MODE } from '@/lib/env'
import { cn } from '@/lib/utils'

/**
 * Marca de dado não confirmado. Só aparece com VITE_PROPOSAL_MODE=true;
 * sem a flag, não renderiza nada.
 */
export function Todo({ children, className }: { children?: ReactNode; className?: string }) {
  if (!PROPOSAL_MODE) return null
  return (
    <span
      className={cn(
        'inline-block border-2 border-dashed border-red bg-paper-2 px-1.5 py-0.5 align-middle font-sans text-[0.8125rem] font-normal normal-case leading-snug tracking-normal text-ink',
        className,
      )}
    >
      <strong className="font-cond text-sm font-bold uppercase tracking-wide text-red">TODO-CONFIRMAR</strong>
      {children ? <> · {children}</> : null}
    </span>
  )
}

/** Conteúdo que só existe no modo proposta. */
export function ProposalOnly({ children }: { children: ReactNode }) {
  return PROPOSAL_MODE ? <>{children}</> : null
}
