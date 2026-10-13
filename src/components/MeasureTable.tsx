import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { BANDS } from '@/data/bands'
import { CATEGORIES, type BandId, type Category } from '@/data/categories'
import { MEASURE_EXAMPLES, SITE, storeCategoryUrl } from '@/data/site'
import { cn } from '@/lib/utils'

const ref = (c: Category) => String(CATEGORIES.indexOf(c) + 1).padStart(2, '0')

/** Vão roda/paralama em miniatura, só como símbolo da faixa. */
function GapGlyph({ band }: { band: BandId }) {
  const gap = { 1: 15, 2: 8, 3: 4, 4: 1.5 }[band]
  return (
    <svg viewBox="0 0 64 40" className="h-8 w-12" aria-hidden="true" focusable="false">
      <path d="M 10 40 A 22 22 0 0 1 54 40" fill="none" className="stroke-ink" strokeWidth={4} />
      <path
        d={`M 6 ${44 - gap} A 26 26 0 0 1 58 ${44 - gap}`}
        fill="none"
        className="stroke-red"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  )
}

// Cada faixa desce um degrau e anda pra direita: a tabela inteira "rebaixa".
const STEP: Record<BandId, string> = {
  1: 'lg:ml-0 lg:w-[74%]',
  2: 'lg:ml-[7%] lg:w-[70%] lg:mt-14',
  3: 'lg:ml-[15%] lg:w-[66%] lg:mt-20',
  4: 'lg:col-start-2 lg:row-start-1',
}

function BandGroup({ band }: { band: BandId }) {
  const b = BANDS[band - 1]
  const items = CATEGORIES.filter((c) => c.band === band)
  return (
    <div className={cn(band !== 4 && 'mt-12 first:mt-0', STEP[band])}>
      <h3 className="flex items-end gap-3 border-b-[3px] border-ink pb-1.5">
        <span className="num font-cond text-5xl font-extrabold leading-[0.8] text-red" aria-hidden="true">
          {b.id}
        </span>
        <span className="font-cond text-xl font-bold uppercase leading-none tracking-wide">
          <span className="sr-only">Faixa {b.id}: </span>
          {b.name}
        </span>
        <span className="ml-auto">
          <GapGlyph band={b.id} />
        </span>
      </h3>
      <ol className="list-none">
        {items.map((c) => (
          <Row key={c.slug} c={c} />
        ))}
      </ol>
    </div>
  )
}

function Row({ c }: { c: Category }) {
  return (
    <li className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)_1.25rem] items-baseline gap-x-3 border-b border-ink/35 py-3 md:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)_1.5rem] md:gap-x-5">
      <span className="num font-cond text-lg font-semibold text-muted">{ref(c)}</span>
      <ExternalLink
        href={storeCategoryUrl(c.slug)}
        className="font-cond text-[1.6rem] font-bold uppercase leading-[1.02] after:absolute after:inset-0 after:content-[''] group-hover:text-red md:text-[1.85rem]"
      >
        {c.name}
      </ExternalLink>
      <span className="col-start-2 row-start-2 mt-0.5 text-[0.9375rem] leading-snug text-muted md:col-start-3 md:row-start-1 md:mt-0">
        {c.use}
      </span>
      <Arrow out className="col-start-3 row-start-1 self-center text-red md:col-start-4" />
    </li>
  )
}

export function MeasureTable() {
  const outside = CATEGORIES.filter((c) => c.band === null)

  return (
    <section id="linhas" aria-labelledby="linhas-titulo" className="relative pb-24 md:pb-32">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <h2 id="linhas-titulo" className="lg:col-span-6">
          <span className="num block font-cond text-[clamp(7rem,30vw,15rem)] font-extrabold leading-[0.78] tracking-tight">
            19
          </span>
          <span className="mt-3 block max-w-[18ch] font-cond text-[clamp(1.9rem,6vw,3rem)] font-bold uppercase leading-[0.95]">
            linhas na loja, da mais alta pra mais baixa
          </span>
        </h2>

        <aside
          aria-label="Exemplos de medida"
          className="border-l-[3px] border-ink pl-4 lg:col-span-5 lg:col-start-8 lg:mt-24 lg:self-start"
        >
          <p className="font-cond text-sm font-semibold uppercase tracking-wider text-muted">
            Medidas que estão na loja
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <p className="num font-cond text-[5.5rem] font-extrabold leading-[0.8]">1,5&quot;</p>
              <p className="mt-2 max-w-[24ch] text-sm leading-snug text-muted">
                {MEASURE_EXAMPLES[0].what} ({MEASURE_EXAMPLES[0].car}) e {MEASURE_EXAMPLES[1].what} (
                {MEASURE_EXAMPLES[1].car})
              </p>
            </div>
            <div className="sm:pb-6">
              <p className="num font-cond text-[3.75rem] font-extrabold leading-[0.8]">
                32<span className="ml-1 text-[0.5em] font-bold">mm</span>
              </p>
              <p className="mt-2 max-w-[22ch] text-sm leading-snug text-muted">
                {MEASURE_EXAMPLES[2].what} ({MEASURE_EXAMPLES[2].car})
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-14 md:mt-20">
        {BANDS.filter((b) => b.id !== 4).map((b) => (
          <BandGroup key={b.id} band={b.id} />
        ))}

        <div className="mt-12 flex flex-col lg:mt-12 lg:grid lg:grid-cols-[21%_1fr] lg:gap-x-[4%]">
          <BandGroup band={4} />
          <div className="mt-16 lg:col-start-1 lg:row-start-1 lg:mt-28">
            <h3 className="font-cond text-xl font-bold uppercase leading-none tracking-wide">Fora da régua</h3>
            <p className="mt-1 text-sm text-muted">Não dependem da altura do carro.</p>
            <ul className="mt-3 border-t-[3px] border-ink">
              {outside.map((c) => (
                <li key={c.slug} className="border-b border-ink/35">
                  <ExternalLink
                    href={storeCategoryUrl(c.slug)}
                    className="group flex items-baseline gap-2 py-2.5 hover:text-red"
                  >
                    <span className="num font-cond text-sm font-semibold text-muted">{ref(c)}</span>
                    <span className="font-cond text-[1.35rem] font-bold uppercase leading-tight">{c.name}</span>
                    <Arrow out className="ml-auto self-center text-red" />
                  </ExternalLink>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <ExternalLink href={SITE.store} className="link-ink font-medium">
                Loja inteira
              </ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
