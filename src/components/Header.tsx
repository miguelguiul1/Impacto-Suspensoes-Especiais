import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { Wordmark, WordmarkTodo } from './Wordmark'
import { SITE } from '@/data/site'

export function Header() {
  return (
    <header className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 md:pt-7">
      <a href="#altura" className="mr-auto block" aria-label="Impacto Suspensões Especiais — início">
        <Wordmark />
      </a>
      <nav
        aria-label="Principal"
        className="flex items-center gap-x-5 font-cond text-lg font-semibold uppercase tracking-wide"
      >
        <a href="#linhas" className="hidden hover:text-red sm:inline">
          Linhas
        </a>
        <a href="#contato" className="hover:text-red">
          Contato
        </a>
        <ExternalLink
          href={SITE.store}
          className="inline-flex items-center gap-1.5 border-2 border-ink px-3 py-1 hover:border-red hover:text-red"
        >
          Loja <Arrow out />
        </ExternalLink>
      </nav>
      <div className="basis-full empty:hidden">
        <WordmarkTodo />
      </div>
    </header>
  )
}
