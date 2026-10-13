import { Arrow } from './Arrow'
import { CarSketch } from './CarSketch'
import { ExternalLink } from './ExternalLink'
import { Todo } from './Todo'
import { BANDS } from '@/data/bands'
import { storeCategoryUrl } from '@/data/site'
import { PROPOSAL_MODE } from '@/lib/env'

/*
 * Nada sobre o evento está confirmado (quem organiza, data, papel da Impacto).
 * Por isso a seção inteira só existe no modo proposta. O cartaz "First Track
 * Day" não é usado sem autorização do dono, e o desenho aqui não o copia.
 */
export function TrackDay() {
  if (!PROPOSAL_MODE) return null
  const low = BANDS[3]

  return (
    <section id="track-day" aria-labelledby="track-titulo" className="relative pb-24 md:pb-32">
      {/* faixa de velocidade em azul-céu */}
      <div aria-hidden="true" className="h-3 bg-sky md:h-4" />
      <div aria-hidden="true" className="ml-[18%] mt-1.5 h-1.5 bg-sky" />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-y-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <h2
            id="track-titulo"
            className="font-cond text-[clamp(3rem,12vw,6.5rem)] font-extrabold uppercase leading-[0.82]"
          >
            Track Day
          </h2>
          <div className="mt-5 space-y-3 leading-relaxed">
            <p>
              <Todo>quem organiza o evento</Todo>
            </p>
            <p>
              <Todo>data e local</Todo>
            </p>
            <p>
              <Todo>qual o papel da Impacto no evento</Todo>
            </p>
            <p>
              <Todo>cartaz “First Track Day” só com autorização do dono</Todo>
            </p>
          </div>
          <ExternalLink
            href={storeCategoryUrl('suspensao-track-day')}
            className="mt-8 inline-flex items-center gap-2 bg-red px-4 py-2.5 font-cond text-xl font-bold uppercase tracking-wide text-paper hover:bg-ink"
          >
            Linha Suspensão Track-Day <Arrow out />
          </ExternalLink>
        </div>
        <div className="lg:col-span-7 lg:mt-16">
          <CarSketch offset={low.bodyOffset} tilt={low.tilt} annotate={false} speed className="h-auto w-full" />
        </div>
      </div>
    </section>
  )
}
