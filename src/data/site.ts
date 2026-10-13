/**
 * Fatos confirmados. Tudo que aparece como verdade no site sai daqui.
 * Não acrescente nada sem confirmação do dono.
 */
export const SITE = {
  name: 'Impacto Suspensões Especiais',
  address: {
    street: 'Rua Valter Ribeiro Marrany, 275',
    district: 'Vila Santa Maria',
    postalCode: '04810-010',
    city: 'São Paulo',
    state: 'SP',
  },
  phone: { display: '(11) 5666-5036', tel: '+551156665036' },
  email: 'contato@impactoespeciais.com.br',
  instagram: [
    { handle: '@impactoespeciais', url: 'https://www.instagram.com/impactoespeciais/', note: 'perfil oficial' },
    {
      handle: '@loja.impactoespeciais',
      url: 'https://www.instagram.com/loja.impactoespeciais/',
      note: 'produtos e dicas de suspensão',
    },
  ],
  store: 'https://www.lojaimpactoespeciais.com.br',
} as const

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.district}, ${SITE.address.postalCode}, ${SITE.address.city}/${SITE.address.state}`

export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city} - ${SITE.address.state}, ${SITE.address.postalCode}`,
)}`

export function storeCategoryUrl(slug: string): string {
  return `${SITE.store}/${slug}/c`
}

/** Medidas reais de produtos da loja, usadas só como ilustração gráfica. */
export const MEASURE_EXAMPLES = [
  { value: '1,5"', what: 'kit lift', car: 'Ford Maverick' },
  { value: '1,5"', what: 'prolongador lift', car: 'Jeep Compass' },
  { value: '32 mm', what: 'calço de mola traseiro', car: 'Fiat Punto' },
] as const
