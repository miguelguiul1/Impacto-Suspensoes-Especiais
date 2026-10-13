import { useEffect, useRef, useState } from 'react'
import { CarSketch } from './CarSketch'
import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { ProposalOnly, Todo } from './Todo'
import { Slider } from './ui/slider'
import { BANDS, BAND_CATEGORIES } from '@/data/bands'
import { categoryBySlug, type BandId } from '@/data/categories'
import { SITE, storeCategoryUrl } from '@/data/site'
import { WHATSAPP_NUMBER } from '@/lib/env'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { useTween } from '@/lib/useTween'
import { cn } from '@/lib/utils'

/** Nível do slider: 3 = mais alto (faixa 1) … 0 = mais baixo (faixa 4). */
const toLevel = (band: BandId) => 4 - band
const toBand = (level: number) => (4 - level) as BandId

export function HeightControl() {
  const reduced = useReducedMotion()
  // Sem movimento reduzido, o carro abre na altura original e assenta no
  // rebaixado sozinho, mostrando o controle em uso. Com movimento reduzido,
  // já abre no rebaixado.
  const [bandId, setBandId] = useState<BandId>(() => (reduced ? 3 : 2))
  const touched = useRef(false)
  const band = BANDS[bandId - 1]

  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => {
      if (!touched.current) setBandId(3)
    }, 650)
    return () => window.clearTimeout(t)
  }, [reduced])

  const choose = (id: BandId) => {
    touched.current = true
    setBandId(id)
  }

  const pose = useTween({ offset: band.bodyOffset, tilt: band.tilt }, reduced)
  const categories = BAND_CATEGORIES[bandId].map(categoryBySlug)
  const whatsapp = WHATSAPP_NUMBER
    ? buildWhatsAppUrl(WHATSAPP_NUMBER, `Olá! Vim pelo site. Quero ver suspensão na faixa "${band.name}".`)
    : null

  return (
    <section id="altura" aria-labelledby="altura-titulo" className="pb-20 pt-6 md:pb-28 md:pt-10">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-6 lg:grid-cols-12">
        <h1
          id="altura-titulo"
          className="font-cond text-[clamp(3.1rem,13.5vw,8.75rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em] lg:col-span-8"
        >
          <span className="block">Cada carro</span>
          <span className="block pl-[6%]">tem a sua</span>
          <span className="block pl-[18%]">
            <span className="relative inline-block">
              altura.
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-0 right-[0.3em] h-3 border-x-[3px] border-red md:-bottom-4"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-red" />
              </span>
            </span>
          </span>
        </h1>

        <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted lg:col-span-4 lg:self-end lg:pb-3">
          Sobe e desce o carro no controle e vê onde o seu se encaixa. Cada altura aponta pra linha certa da{' '}
          <ExternalLink href={SITE.store} className="link-ink text-ink">
            loja
          </ExternalLink>
          .
        </p>

        {/* Prancha com o desenho e o controle */}
        <div className="sheet-grid relative mt-4 border-2 border-ink bg-paper lg:col-span-9 lg:mt-8 lg:self-start">
          <div className="flex flex-col md:flex-row">
            <div className="relative flex flex-1 flex-col justify-center px-2 pb-2 pt-6 md:px-5 md:pt-8">
              <CarSketch
                offset={pose.offset}
                tilt={pose.tilt}
                className="h-auto w-full"
                title={`Desenho de um carro de perfil na faixa ${band.id}: ${band.name}`}
              />
              <p className="mt-1 px-1 text-xs text-muted">
                Desenho ilustrativo. As rodas ficam no chão; quem sobe e desce é a carroceria.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row border-t-2 border-ink px-4 py-5 md:w-[208px] md:flex-col md:border-l-2 md:border-t-0 md:py-6">
              <div className="flex h-[184px] gap-3 md:h-[232px]">
                <Slider
                  orientation="vertical"
                  min={0}
                  max={3}
                  step={1}
                  value={[toLevel(bandId)]}
                  onValueChange={([v]) => choose(toBand(v))}
                  thumbLabel="Altura da carroceria"
                  thumbValueText={`Faixa ${band.id} de 4: ${band.name}`}
                />
                {/* Atalho de mouse/toque; pelo teclado, o slider já cobre tudo. */}
                <ol aria-hidden="true" className="flex flex-col justify-between">
                  {BANDS.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => choose(b.id)}
                        className={cn(
                          'flex h-7 items-center gap-2 font-cond text-lg font-semibold uppercase leading-none tracking-wide',
                          b.id === bandId ? 'text-red' : 'text-muted hover:text-ink',
                        )}
                      >
                        <span className="num w-3 text-right">{b.id}</span>
                        {b.short}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <ExternalLink
                href={storeCategoryUrl('suspensao-fusca')}
                className="plate group flex min-w-0 flex-col justify-end px-4 pb-3 pt-6 sm:ml-auto sm:flex-1 sm:self-end md:ml-0 md:w-full md:flex-none md:self-stretch"
              >
                <span className="font-cond text-sm font-semibold uppercase tracking-wider text-muted">Atalho</span>
                <span className="font-cond text-2xl font-bold uppercase leading-none group-hover:text-red">
                  Suspensão Fusca <Arrow out />
                </span>
                <span className="mt-1 text-xs leading-snug text-muted">O Fusca tem linha própria na loja.</span>
              </ExternalLink>
            </div>
          </div>

          {/* carimbo da prancha */}
          <dl className="grid grid-cols-[auto_1fr] border-t-2 border-ink font-cond text-sm uppercase tracking-wide bg-paper sm:ml-auto sm:w-[340px] sm:border-l-2">
            <dt className="border-b border-r border-ink/60 px-2 py-1 text-muted">Prancha</dt>
            <dd className="border-b border-ink/60 px-2 py-1 font-semibold">01 · Altura da carroceria</dd>
            <dt className="border-r border-ink/60 px-2 py-1 text-muted">Faixa</dt>
            <dd className="num px-2 py-1 font-semibold">
              {band.id}/4 · {band.name}
            </dd>
          </dl>
        </div>

        {/* Painel da faixa escolhida */}
        <div className="lg:col-span-3 lg:mt-24">
          <div className="flex items-end gap-3 border-b-[3px] border-ink pb-2">
            <span className="num font-cond text-[6.5rem] font-extrabold leading-[0.78] text-red" aria-hidden="true">
              {band.id}
            </span>
            <span className="num pb-1 font-cond text-2xl font-semibold text-muted" aria-hidden="true">
              /4
            </span>
          </div>
          <h2 className="mt-3 font-cond text-3xl font-bold uppercase leading-none">
            <span className="sr-only">Faixa {band.id}: </span>
            {band.name}
          </h2>
          <p className="mt-3 leading-relaxed">{band.use}</p>

          <p className="mt-6 font-cond text-sm font-semibold uppercase tracking-wider text-muted">
            Linhas da loja pra essa altura
          </p>
          <ul className="mt-1 border-t border-ink/40">
            {categories.map((c) => (
              <li key={c.slug} className="border-b border-ink/40">
                <ExternalLink
                  href={storeCategoryUrl(c.slug)}
                  className="flex items-center justify-between gap-3 py-2.5 font-cond text-xl font-semibold uppercase leading-tight hover:text-red"
                >
                  {c.name}
                  <Arrow out className="text-red" />
                </ExternalLink>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            Ficou na dúvida entre duas?{' '}
            {whatsapp ? (
              <ExternalLink href={whatsapp} className="link-ink font-medium text-ink">
                Pergunta no WhatsApp
              </ExternalLink>
            ) : (
              <>
                Liga:{' '}
                <a href={`tel:${SITE.phone.tel}`} className="link-ink num whitespace-nowrap font-medium text-ink">
                  {SITE.phone.display}
                </a>
              </>
            )}
            .
          </p>
          <ProposalOnly>
            <p className="mt-3">
              <Todo>aviso legal sobre alterar a altura do carro (texto a definir com o dono)</Todo>
            </p>
          </ProposalOnly>
        </div>
      </div>
    </section>
  )
}
