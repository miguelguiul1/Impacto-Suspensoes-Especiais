import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { Wordmark } from './Wordmark'
import { FULL_ADDRESS, SITE } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t-[6px] border-ink pb-10 pt-8">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-8 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <Wordmark />
          <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-muted">{FULL_ADDRESS}</p>
        </div>

        <div className="md:col-span-4 md:col-start-5">
          <p className="font-cond text-sm font-semibold uppercase tracking-wider text-muted">Instagram</p>
          <ul className="mt-2 space-y-2">
            {SITE.instagram.map((ig) => (
              <li key={ig.handle}>
                <ExternalLink href={ig.url} className="link-ink text-lg font-medium">
                  {ig.handle}
                </ExternalLink>
                <span className="block text-sm text-muted">{ig.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 md:col-start-9 md:mt-10">
          <ExternalLink
            href={SITE.store}
            className="group block border-2 border-ink px-4 py-3 hover:border-red hover:text-red"
          >
            <span className="block font-cond text-sm font-semibold uppercase tracking-wider text-muted">
              Loja virtual
            </span>
            <span className="flex items-center justify-between gap-2 break-all font-cond text-xl font-bold uppercase leading-tight lg:text-2xl">
              lojaimpactoespeciais.com.br
              <Arrow out />
            </span>
          </ExternalLink>
        </div>
      </div>
    </footer>
  )
}
