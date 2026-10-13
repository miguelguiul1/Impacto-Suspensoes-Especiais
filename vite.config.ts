import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { CATEGORIES } from './src/data/categories.ts'
import { SITE, storeCategoryUrl } from './src/data/site.ts'

const OG_ALT = 'Desenho de um carro de perfil sobre uma régua de altura, com o nome Impacto Suspensões Especiais.'

/** Cabeçalhos de segurança do vercel.json, repetidos no `vite preview` para testar igual. */
function vercelHeaders(): Record<string, string> {
  const cfg = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }
  const all = cfg.headers.find((h) => h.source === '/(.*)')
  return Object.fromEntries((all?.headers ?? []).map((h) => [h.key, h.value]))
}

const esc = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

/** VITE_SITE_URL válido (http/https, sem barra no fim) ou null. */
function parseSiteUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null
  try {
    const u = new URL(value)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return `${u.origin}${u.pathname}`.replace(/\/+$/, '')
  } catch {
    return null
  }
}

/** Versão estática para quem está sem JavaScript: só fatos confirmados, sem TODO. */
function noscriptHtml(): string {
  const a = SITE.address
  const ext = (href: string, text: string) =>
    `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`
  const items = CATEGORIES.map((c) => `<li>${ext(storeCategoryUrl(c.slug), c.name)}</li>`).join('')
  return `<noscript>
      <div class="nojs">
        <p class="nojs-name">${esc(SITE.name)}</p>
        <p>Cada carro tem a sua altura.</p>
        <address>
          ${esc(a.street)}, ${esc(a.district)}<br />
          ${esc(a.postalCode)} · ${esc(a.city)}/${esc(a.state)}<br />
          Telefone: <a href="tel:${SITE.phone.tel}">${esc(SITE.phone.display)}</a><br />
          E-mail: <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
        </address>
        <h2>Linhas da loja</h2>
        <ul>${items}</ul>
        <p>Loja virtual: ${ext(SITE.store, 'lojaimpactoespeciais.com.br')}</p>
      </div>
    </noscript>`
}

/**
 * SEO só com fatos confirmados: JSON-LD (LocalBusiness), Open Graph com URL
 * absoluta e a versão sem JavaScript. Sem VITE_SITE_URL válido, o build avisa e
 * não gera og:image/twitter:image (nada de URL relativa nessas tags).
 */
function seo(rawSiteUrl: string): Plugin {
  const base = parseSiteUrl(rawSiteUrl)
  let warn: (msg: string) => void = () => {}
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.street} - ${SITE.address.district}`,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: 'BR',
    },
    telephone: '+55-11-5666-5036',
    email: SITE.email,
    ...(base ? { url: `${base}/`, image: `${base}/og.png` } : {}),
    sameAs: [...SITE.instagram.map((i) => i.url), SITE.store],
  }
  const image = base
    ? [
        `<meta property="og:image" content="${esc(base)}/og.png" />`,
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        `<meta property="og:image:alt" content="${esc(OG_ALT)}" />`,
        `<meta name="twitter:image" content="${esc(base)}/og.png" />`,
        `<meta name="twitter:image:alt" content="${esc(OG_ALT)}" />`,
      ].join('\n    ')
    : ''
  return {
    name: 'impacto-seo',
    configResolved(config) {
      if (config.command !== 'build') return
      warn = (msg) => config.logger.warn(`\n[impacto-seo] ${msg}\n`)
    },
    buildStart() {
      if (base) return
      warn(
        rawSiteUrl.trim()
          ? `VITE_SITE_URL inválido ("${rawSiteUrl}"). Use uma URL completa, ex.: https://impacto.vercel.app. ` +
              'og:image, twitter:image e og:url ficaram de fora deste build.'
          : 'VITE_SITE_URL não definido. og:image, twitter:image e og:url ficaram de fora deste build ' +
              '(sem URL relativa). Defina a variável com o endereço público do site.',
      )
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace('<!--og:url-->', base ? `<meta property="og:url" content="${esc(base)}/" />` : '')
          .replace('<!--og:image-->', image)
          .replace(
            '<!--json-ld-->',
            `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
          )
          .replace('<!--noscript-->', noscriptHtml())
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), seo(env.VITE_SITE_URL ?? '')],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    // Nada embutido como data: — mantém a CSP fechada em 'self'.
    build: { assetsInlineLimit: 0 },
    preview: { headers: vercelHeaders() },
  }
})
