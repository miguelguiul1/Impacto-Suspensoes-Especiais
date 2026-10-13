/** Modo proposta: mostra as marcas TODO-CONFIRMAR. Ligado só com VITE_PROPOSAL_MODE=true. */
export const PROPOSAL_MODE = import.meta.env.VITE_PROPOSAL_MODE === 'true'

/** Número de WhatsApp. Só existe depois de confirmado pelo dono (variável de ambiente). */
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').trim()
