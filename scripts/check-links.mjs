// Verifica se as 19 categorias da loja abrem de verdade.
// Uso (precisa de rede até a loja): npm run links
// Lê os slugs de src/data/categories.ts, segue redirecionamentos e marca como
// suspeita a página que responde 200 mas parece "não encontrada".
import { readFileSync, appendFileSync } from 'node:fs'

const STORE = 'https://www.lojaimpactoespeciais.com.br'
const src = readFileSync(new URL('../src/data/categories.ts', import.meta.url), 'utf8')
const cats = [...src.matchAll(/slug: '([^']+)',\s*name: (['"])(.+?)\2/g)].map((m) => ({ slug: m[1], name: m[3] }))
if (cats.length !== 19) {
  console.error(`Esperava 19 categorias, achei ${cats.length}`)
  process.exit(2)
}

const norm = (v) =>
  v
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const NOT_FOUND = /(p[áa]gina n[ãa]o encontrada|n[ãa]o encontramos|404|not found|categoria n[ãa]o encontrada)/i
const rows = []
for (const c of cats) {
  const url = `${STORE}/${c.slug}/c`
  let row
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
      headers: { 'user-agent': 'Mozilla/5.0 (verificador de links do site Impacto)', 'accept-language': 'pt-BR' },
    })
    const html = await res.text()
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').replace(/\s+/g, ' ').trim()
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    const suspicious = NOT_FOUND.test(title) || NOT_FOUND.test(h1)
    // nome da categoria no HTML (sem acento/caixa/pontuação): prova que é a página certa
    const named = norm(html).includes(norm(c.name).replace(/^suspensao /, ''))
    const verdict = !res.ok ? 'FALHA' : suspicious ? 'SUSPEITA' : named ? 'ABRE' : 'SEM NOME'
    row = {
      verdict,
      slug: c.slug,
      status: res.status,
      final: res.url,
      title: title.slice(0, 80),
      h1: h1.slice(0, 60),
      bytes: html.length,
    }
  } catch (e) {
    row = { verdict: 'ERRO', slug: c.slug, status: '-', final: url, title: String(e.cause?.code ?? e.message), h1: '' }
  }
  rows.push(row)
  console.log(
    `${row.verdict.padEnd(8)} ${row.status} ${String(row.bytes ?? '').padStart(7)}B  ${c.slug}  →  ${row.final}  | ${row.title} | ${row.h1}`,
  )
}

// Controle: um slug que não existe. Se também der 200 com a mesma cara, HTTP 200 sozinho não prova nada.
try {
  const res = await fetch(`${STORE}/categoria-que-nao-existe-impacto-qa/c`, { signal: AbortSignal.timeout(25000) })
  const html = await res.text()
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
  console.log(`\nCONTROLE (slug inventado): HTTP ${res.status}, ${html.length}B, título "${title}"`)
} catch (e) {
  console.log(`\nCONTROLE: erro ${e.cause?.code ?? e.message}`)
}

const ok = rows.filter((r) => r.verdict === 'ABRE').length
console.log(`\n${ok}/19 abrem.`)
if (process.env.GITHUB_STEP_SUMMARY) {
  const md = ['| Resultado | HTTP | Slug | URL final | Título | H1 |', '|---|---|---|---|---|---|']
  for (const r of rows) md.push(`| ${r.verdict} | ${r.status} | ${r.slug} | ${r.final} | ${r.title} | ${r.h1} |`)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md.join('\n')}\n\n${ok}/19 abrem.\n`)
}
process.exit(ok === 19 ? 0 : 1)
