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
    const verdict = res.ok && !suspicious ? 'ABRE' : res.ok ? 'SUSPEITA' : 'FALHA'
    row = { verdict, slug: c.slug, status: res.status, final: res.url, title: title.slice(0, 80), h1: h1.slice(0, 60) }
  } catch (e) {
    row = { verdict: 'ERRO', slug: c.slug, status: '-', final: url, title: String(e.cause?.code ?? e.message), h1: '' }
  }
  rows.push(row)
  console.log(`${row.verdict.padEnd(8)} ${row.status}  ${c.slug}  →  ${row.final}  | ${row.title} | ${row.h1}`)
}

const ok = rows.filter((r) => r.verdict === 'ABRE').length
console.log(`\n${ok}/19 abrem.`)
if (process.env.GITHUB_STEP_SUMMARY) {
  const md = ['| Resultado | HTTP | Slug | URL final | Título | H1 |', '|---|---|---|---|---|---|']
  for (const r of rows) md.push(`| ${r.verdict} | ${r.status} | ${r.slug} | ${r.final} | ${r.title} | ${r.h1} |`)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md.join('\n')}\n\n${ok}/19 abrem.\n`)
}
process.exit(ok === 19 ? 0 : 1)
