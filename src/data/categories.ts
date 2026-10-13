/**
 * As 19 categorias reais da loja. O slug é o da URL da loja, sem correção
 * (inclusive "amortecedortes", que é como está lá).
 * "use" descreve só o uso — nada de desempenho, garantia ou legalidade.
 */
export type BandId = 1 | 2 | 3 | 4

export type Category = {
  slug: string
  name: string
  use: string
  band: BandId | null
}

export const CATEGORIES: Category[] = [
  // Faixa 1 — mais alto
  {
    slug: 'off-roads--4x4--lift',
    name: 'Off-roads / 4x4 / Lift',
    use: 'Pra quem sai do asfalto e quer o carro mais alto.',
    band: 1,
  },
  { slug: 'calco-lift-traseiro', name: 'Calço Lift Traseiro', use: 'Calço pra subir a traseira.', band: 1 },
  { slug: 'utvs--can-am---polaris', name: "UTV's / Can-Am – Polaris", use: 'Pra quem anda de UTV.', band: 1 },
  // Faixa 2 — original ou levemente baixo
  { slug: 'molas', name: 'Molas', use: 'Pra trocar mola ou mexer pouco na altura.', band: 2 },
  { slug: 'amortecedortes', name: 'Amortecedores', use: 'Troca de amortecedor, no carro de todo dia.', band: 2 },
  {
    slug: 'buchas-poliuretano',
    name: 'Buchas Poliuretano',
    use: 'Buchas de poliuretano pra quem está refazendo a suspensão.',
    band: 2,
  },
  { slug: 'bandejas', name: 'Bandejas', use: 'Bandeja pra quem está mexendo na suspensão.', band: 2 },
  // Faixa 3 — rebaixada de rua
  { slug: 'suspensao-turbo-rua', name: 'Suspensão Turbo Rua', use: 'Pra carro turbo que roda na rua.', band: 3 },
  {
    slug: 'suspensao-esportiva',
    name: 'Suspensão Esportiva',
    use: 'Pra quem quer o carro mais baixo e segue andando na rua.',
    band: 3,
  },
  { slug: 'coil-overs', name: 'Coil Overs', use: 'Mola e amortecedor num conjunto só.', band: 3 },
  { slug: 'camber-plates', name: 'Camber Plates', use: 'Pra quem mexe no câmber do carro rebaixado.', band: 3 },
  // Faixa 4 — baixo e técnico
  { slug: 'suspensao-track-day', name: 'Suspensão Track-Day', use: 'Pra quem leva o carro pro track day.', band: 4 },
  { slug: 'suspensao-circuito', name: 'Suspensão Circuito', use: 'Pra carro de circuito.', band: 4 },
  { slug: 'suspensao-drift', name: 'Suspensão Drift', use: 'Pra quem anda de lado.', band: 4 },
  { slug: 'suspensao-arrancada', name: 'Suspensão Arrancada', use: 'Pra carro de arrancada.', band: 4 },
  {
    slug: 'barras-estruturais',
    name: 'Barras Estruturais',
    use: 'Barras pra carroceria, comuns em carro de pista.',
    band: 4,
  },
  // Fora da régua
  { slug: 'suspensao-fusca', name: 'Suspensão Fusca', use: 'O Fusca tem prateleira própria.', band: null },
  { slug: 'acessorios', name: 'Acessórios', use: 'Acessórios avulsos.', band: null },
  { slug: 'artigos-casuais', name: 'Artigos Casuais', use: 'O que não vai no carro.', band: null },
]

export const categoryBySlug = (slug: string): Category => {
  const found = CATEGORIES.find((c) => c.slug === slug)
  if (!found) throw new Error(`Categoria desconhecida: ${slug}`)
  return found
}
