import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { SITE } from './src/data/site.ts'

/** Cabeçalhos de segurança do vercel.json, repetidos no `vite preview` para testar igual. */
function vercelHeaders(): Record<string, string> {
  const cfg = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }
  const all = cfg.headers.find((h) => h.source === '/(.*)')
  return Object.fromEntries((all?.headers ?? []).map((h) => [h.key, h.value]))
}

/** Gera JSON-LD (LocalBusiness) e URLs absolutas de Open Graph só com fatos confirmados. */
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/+$/, '')
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
    ...(base ? { url: base, image: `${base}/og.png` } : {}),
    sameAs: [...SITE.instagram.map((i) => i.url), SITE.store],
  }
  return {
    name: 'impacto-seo',
    transformIndexHtml(html) {
      return html
        .replace('%OG_IMAGE%', base ? `${base}/og.png` : '/og.png')
        .replace('<!--og:url-->', base ? `<meta property="og:url" content="${base}/" />` : '')
        .replace(
          '<!--json-ld-->',
          `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
        )
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
