import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { DICAS } from '@/data/dicas'

export function Dicas() {
  if (DICAS.length === 0) return null
  return (
    <section id="dicas" aria-labelledby="dicas-titulo" className="pb-24 md:pb-32">
      <h2
        id="dicas-titulo"
        className="font-cond text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold uppercase leading-[0.9]"
      >
        Dicas de suspensão
      </h2>
      <ol className="mt-6 border-t-[3px] border-ink">
        {DICAS.map((d) => (
          <li key={d.url} className="border-b border-ink/35">
            <ExternalLink href={d.url} className="flex items-center justify-between gap-4 py-3 text-lg hover:text-red">
              {d.title}
              <Arrow out className="text-red" />
            </ExternalLink>
          </li>
        ))}
      </ol>
    </section>
  )
}
