import { PROPOSAL_MODE } from '@/lib/env'

export function ProposalBanner() {
  if (!PROPOSAL_MODE) return null
  return (
    <div
      role="note"
      className="border-b-2 border-dashed border-red bg-paper-2 px-4 py-2 text-center text-sm leading-snug"
    >
      <strong className="font-cond font-bold uppercase tracking-wide text-red">Modo proposta.</strong> As marcas
      TODO-CONFIRMAR mostram o que ainda depende do dono. Com <code>VITE_PROPOSAL_MODE=false</code> elas somem.
    </div>
  )
}
