import { Arrow } from './Arrow'
import { ExternalLink } from './ExternalLink'
import { ProposalOnly, Todo } from './Todo'
import { MAP_URL, SITE } from '@/data/site'
import { WHATSAPP_NUMBER } from '@/lib/env'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export function Contact() {
  const whatsapp = WHATSAPP_NUMBER ? buildWhatsAppUrl(WHATSAPP_NUMBER, 'Olá! Vim pelo site da Impacto.') : null

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative pb-24 md:pb-32">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-y-10 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-7 md:col-start-2 lg:col-span-6 lg:col-start-3">
          <h2
            id="contato-titulo"
            className="font-cond text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold uppercase leading-[0.9]"
          >
            Onde estamos
          </h2>

          {/* plaquinha com o endereço */}
          <address className="plate mt-6 block bg-paper px-6 pb-6 pt-8 not-italic md:px-10 md:pb-8 md:pt-10">
            <span className="block font-cond text-[clamp(1.6rem,6vw,2.6rem)] font-bold uppercase leading-[1.02]">
              {SITE.address.street}
            </span>
            <span className="mt-2 block font-cond text-xl font-semibold uppercase tracking-wide text-muted">
              {SITE.address.district} · <span className="num">{SITE.address.postalCode}</span>
            </span>
            <span className="block font-cond text-xl font-semibold uppercase tracking-wide text-muted">
              {SITE.address.city}/{SITE.address.state}
            </span>
            <ExternalLink
              href={MAP_URL}
              className="mt-5 inline-flex items-center gap-2 border-2 border-ink px-3 py-1.5 font-cond text-lg font-semibold uppercase tracking-wide hover:border-red hover:text-red"
            >
              Abrir no mapa <Arrow out />
            </ExternalLink>
          </address>

          <ProposalOnly>
            <ul className="mt-4 space-y-2">
              <li>
                <Todo>atendimento e instalação no endereço — o cliente pode ir até lá?</Todo>
              </li>
              <li>
                <Todo>horários de atendimento</Todo>
              </li>
              <li>
                <Todo>número de WhatsApp (entra via VITE_WHATSAPP_NUMBER)</Todo>
              </li>
            </ul>
          </ProposalOnly>
        </div>

        <div className="md:col-span-4 md:mt-28">
          <p className="font-cond text-sm font-semibold uppercase tracking-wider text-muted">Telefone</p>
          <a
            href={`tel:${SITE.phone.tel}`}
            className="num block whitespace-nowrap font-cond text-[clamp(2.3rem,12vw,3.4rem)] font-extrabold leading-none hover:text-red md:text-[2.4rem] lg:text-[3.2rem]"
          >
            {SITE.phone.display}
          </a>

          <p className="mt-8 font-cond text-sm font-semibold uppercase tracking-wider text-muted">E-mail</p>
          <a href={`mailto:${SITE.email}`} className="link-ink break-all text-lg font-medium">
            {SITE.email}
          </a>

          {whatsapp && (
            <>
              <p className="mt-8 font-cond text-sm font-semibold uppercase tracking-wider text-muted">WhatsApp</p>
              <ExternalLink href={whatsapp} className="link-ink text-lg font-medium">
                Mandar mensagem
              </ExternalLink>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
