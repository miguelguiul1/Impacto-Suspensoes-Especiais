import type { BandId } from './categories'

export type Band = {
  id: BandId
  /** Nome curto da faixa. */
  name: string
  /** Rótulo ao lado do controle. */
  short: string
  /** Só descreve o uso. */
  use: string
  /** Deslocamento vertical da carroceria no desenho (px do SVG). Negativo = sobe. */
  bodyOffset: number
  /** Inclinação leve da carroceria no desenho (graus). */
  tilt: number
}

export const BANDS: Band[] = [
  {
    id: 1,
    name: 'Mais alto',
    short: 'Mais alto',
    use: 'Terra, trilha, sítio, ou só o gosto de andar lá em cima.',
    bodyOffset: -30,
    tilt: -0.6,
  },
  {
    id: 2,
    name: 'Original ou levemente baixo',
    short: 'Original',
    use: 'O carro de todo dia, na altura de fábrica ou um pouco abaixo. Aqui entra a troca de mola, amortecedor, bucha e bandeja.',
    bodyOffset: 0,
    tilt: 0,
  },
  {
    id: 3,
    name: 'Rebaixada de rua',
    short: 'Rebaixado',
    use: 'Carro baixo que continua no uso de todo dia: trabalho, rolê, mercado.',
    bodyOffset: 12,
    tilt: 0.3,
  },
  {
    id: 4,
    name: 'Baixo e técnico',
    short: 'Pista',
    use: 'Track day, circuito, drift, arrancada. O carro que vive de cronômetro.',
    bodyOffset: 19,
    tilt: 0.5,
  },
]

/** Categorias de cada faixa, na ordem em que aparecem no controle. */
export const BAND_CATEGORIES: Record<BandId, string[]> = {
  1: ['off-roads--4x4--lift', 'calco-lift-traseiro', 'utvs--can-am---polaris'],
  2: ['molas', 'amortecedortes', 'buchas-poliuretano', 'bandejas'],
  3: ['suspensao-turbo-rua', 'suspensao-esportiva', 'coil-overs', 'camber-plates'],
  4: ['suspensao-track-day', 'suspensao-circuito', 'suspensao-drift', 'suspensao-arrancada', 'barras-estruturais'],
}
