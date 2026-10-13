const MAX_MESSAGE = 500

/** Só dígitos, com DDI 55 + DDD + número (12 ou 13 dígitos). */
export function normalizeBrPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (!/^55\d{10,11}$/.test(digits)) return null
  return digits
}

/** Remove caracteres de controle, junta espaços e corta no limite. */
export function sanitizeMessage(raw: string): string {
  return Array.from(raw, (ch) => {
    const code = ch.charCodeAt(0)
    return code < 32 || code === 127 ? ' ' : ch
  })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_MESSAGE)
}

/**
 * Monta o link wa.me. Qualquer texto (inclusive digitado pelo visitante) é
 * validado e passa por encodeURIComponent antes de entrar na URL.
 * Retorna null se o número ou a mensagem não forem válidos.
 */
export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const number = normalizeBrPhone(phone)
  const text = sanitizeMessage(message)
  if (!number || !text) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
