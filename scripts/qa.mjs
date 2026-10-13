// Checagem de entrega: abre o build no `vite preview` (com os mesmos cabeçalhos
// do vercel.json), testa o controle de altura faixa a faixa, os 19 links de
// categoria, rolagem horizontal, erros de console/404 e tira screenshots.
//
// Uso: npm run qa
//   Gera três builds próprios: produção (dist-qa) e proposta (dist-proposta) com
//   um VITE_SITE_URL de teste, e um sem VITE_SITE_URL (dist-semurl) para conferir
//   o aviso do build. Também testa a versão sem JavaScript (noscript).
import { spawn, execSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const OUT = 'qa-output'
const STORE = 'https://www.lojaimpactoespeciais.com.br'
const QA_SITE_URL = 'https://impacto-qa.example.com'
const CONCEPT = /cada carro tem a sua altura/i
const NAME = 'Impacto Suspensões Especiais'
const EXPECTED = {
  1: ['off-roads--4x4--lift', 'calco-lift-traseiro', 'utvs--can-am---polaris'],
  2: ['molas', 'amortecedortes', 'buchas-poliuretano', 'bandejas'],
  3: ['suspensao-turbo-rua', 'suspensao-esportiva', 'coil-overs', 'camber-plates'],
  4: ['suspensao-track-day', 'suspensao-circuito', 'suspensao-drift', 'suspensao-arrancada', 'barras-estruturais'],
}
const ALL_SLUGS = [...Object.values(EXPECTED).flat(), 'suspensao-fusca', 'acessorios', 'artigos-casuais']
const WIDTHS = [320, 390, 1440]

mkdirSync(OUT, { recursive: true })
const failures = []
const check = (ok, msg) => {
  console.log(`${ok ? '  ok ' : 'FALHA'}  ${msg}`)
  if (!ok) failures.push(msg)
}

function preview(dir, port) {
  const p = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'preview', '--outDir', dir, '--port', String(port), '--strictPort'],
    {
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  )
  return new Promise((resolve, reject) => {
    p.stdout.on('data', (d) => {
      if (String(d).includes(String(port))) resolve(p)
    })
    p.on('exit', (code) => reject(new Error(`preview saiu (${code})`)))
  })
}

async function openPage(browser, url, width, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, ...opts })
  const page = await ctx.newPage()
  const problems = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(`console ${m.type()}: ${m.text()}`)
  })
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`)
  })
  page.on('requestfailed', (r) => problems.push(`falhou ${r.url()}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  return { ctx, page, problems }
}

async function bandState(page) {
  return page.evaluate(() => {
    const thumb = document.querySelector('[role="slider"]')
    const panel = [...document.querySelectorAll('#altura ul a')].map((a) => ({
      href: a.getAttribute('href'),
      rel: a.getAttribute('rel'),
      target: a.getAttribute('target'),
    }))
    return { text: thumb?.getAttribute('aria-valuetext'), now: thumb?.getAttribute('aria-valuenow'), panel }
  })
}

async function run(label, dir, port, proposal) {
  console.log(`\n== ${label} ==`)
  const server = await preview(dir, port)
  const url = `http://localhost:${port}/`
  const browser = await chromium.launch()
  try {
    for (const width of WIDTHS) {
      const { ctx, page, problems } = await openPage(browser, url, width, { reducedMotion: 'reduce' })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      check(overflow <= 0, `${width}px sem rolagem horizontal (sobra ${overflow}px)`)
      await page.screenshot({ path: `${OUT}/${label}-${width}.png`, fullPage: true })
      check(
        problems.length === 0,
        `${width}px sem erro de console/404 ${problems.length ? JSON.stringify(problems) : ''}`,
      )
      await ctx.close()
    }

    // Controle de altura: só teclado, todas as faixas
    const { ctx, page, problems } = await openPage(browser, url, 1440, { reducedMotion: 'reduce' })
    const first = await bandState(page)
    check(first.text?.startsWith('Faixa 3 de 4'), `com movimento reduzido abre direto na faixa 3 (${first.text})`)

    await page.focus('[role="slider"]')
    await page.keyboard.press('Home') // mínimo = faixa 4 (mais baixo)
    for (const band of [4, 3, 2, 1]) {
      const s = await bandState(page)
      check(s.text?.startsWith(`Faixa ${band} de 4`), `teclado → faixa ${band}: "${s.text}"`)
      const hrefs = s.panel.map((l) => l.href)
      const want = EXPECTED[band].map((slug) => `${STORE}/${slug}/c`)
      check(JSON.stringify(hrefs) === JSON.stringify(want), `faixa ${band} aponta para ${EXPECTED[band].join(', ')}`)
      check(
        s.panel.every((l) => l.rel === 'noopener noreferrer' && l.target === '_blank'),
        `faixa ${band}: links com rel="noopener noreferrer"`,
      )
      await page.locator('#altura').screenshot({ path: `${OUT}/${label}-faixa-${band}.png` })
      if (band > 1) await page.keyboard.press('ArrowUp')
    }
    await page.keyboard.press('ArrowUp')
    check((await bandState(page)).text?.startsWith('Faixa 1'), 'acima do máximo continua na faixa 1')
    await page.keyboard.press('End')
    check((await bandState(page)).text?.startsWith('Faixa 1'), 'End → faixa 1')

    // Clique nos rótulos ao lado do controle
    await page.locator('#altura ol button', { hasText: 'Pista' }).click()
    check((await bandState(page)).text?.startsWith('Faixa 4'), 'clique no rótulo "Pista" → faixa 4')

    // Atalho Fusca
    const fusca = await page.locator('#altura a', { hasText: 'Suspensão Fusca' }).getAttribute('href')
    check(fusca === `${STORE}/suspensao-fusca/c`, 'atalho Fusca ao lado do controle')

    // Todas as categorias na tabela
    const tableLinks = await page.$$eval('#linhas a[href*="/c"]', (as) => as.map((a) => a.getAttribute('href')))
    for (const slug of ALL_SLUGS) {
      check(tableLinks.includes(`${STORE}/${slug}/c`), `tabela tem ${slug}`)
    }
    check(new Set(tableLinks).size === 19, `tabela com 19 categorias (${new Set(tableLinks).size})`)

    // Links externos
    const badExternal = await page.$$eval('a[href^="http"]', (as) =>
      as.filter((a) => a.getAttribute('rel') !== 'noopener noreferrer').map((a) => a.href),
    )
    check(badExternal.length === 0, `todo link externo com rel="noopener noreferrer" ${badExternal.join(' ')}`)
    const tel = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')))
    check(tel.length > 0 && tel.every((h) => h === 'tel:+551156665036'), 'telefone com link tel:')

    // Proposta x produção
    const body = await page.evaluate(() => document.body.innerText)
    if (proposal) {
      check(body.includes('TODO-CONFIRMAR'), 'modo proposta mostra TODO-CONFIRMAR')
      check(!!(await page.$('#track-day')), 'modo proposta mostra a seção Track Day')
    } else {
      check(!body.includes('TODO'), 'sem a flag nenhuma marca TODO aparece')
      check(!(await page.$('#track-day')), 'sem a flag a seção Track Day não existe')
    }
    check(!(await page.$('#dicas')), 'sem posts reais a seção Dicas não existe')
    check(!(await page.$('iframe')), 'sem iframe de mapa')

    // SEO
    const seo = await page.evaluate(() => ({
      robots: document.querySelector('meta[name="robots"]')?.content,
      ld: JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || 'null'),
      og: document.querySelector('meta[property="og:image"]')?.content,
      tw: document.querySelector('meta[name="twitter:image"]')?.content,
      title: document.title,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? '',
    }))
    check(seo.robots === 'noindex, nofollow', 'meta robots noindex, nofollow')
    check(seo.ld?.['@type'] === 'LocalBusiness' && !seo.ld.openingHours, 'JSON-LD LocalBusiness sem horário inventado')
    check(seo.og === `${QA_SITE_URL}/og.png`, `og:image absoluto (${seo.og})`)
    check(seo.tw === `${QA_SITE_URL}/og.png`, `twitter:image absoluto (${seo.tw})`)
    check(CONCEPT.test(seo.title) && seo.title.includes(NAME), `<title> com conceito e nome ("${seo.title}")`)
    check(CONCEPT.test(seo.ogTitle) && seo.ogTitle.includes(NAME), `og:title com conceito e nome ("${seo.ogTitle}")`)
    const og = await page.request.get(new URL('/og.png', url).href)
    check(
      og.ok() && og.headers()['content-type'] === 'image/png',
      `/og.png é PNG (${og.status()} ${og.headers()['content-type']})`,
    )

    const headers = (await page.request.get(url)).headers()
    check(!!headers['content-security-policy'], 'preview com CSP do vercel.json')
    check(
      problems.length === 0,
      `sem erro de console durante os testes ${problems.length ? JSON.stringify(problems) : ''}`,
    )
    await ctx.close()

    // Sem movimento reduzido: abre na faixa 2 e assenta sozinho na 3
    const anim = await openPage(browser, url, 390)
    await anim.page.waitForTimeout(1500)
    check(
      (await bandState(anim.page)).text?.startsWith('Faixa 3'),
      'com animação, o controle assenta na faixa 3 sozinho',
    )
    await anim.ctx.close()

    // Sem JavaScript: o <noscript> estático precisa bastar
    const nojs = await openPage(browser, url, 390, { javaScriptEnabled: false })
    const fb = await nojs.page.evaluate(() => ({
      text: document.body.innerText,
      links: [...document.querySelectorAll('.nojs a')].map((a) => ({
        href: a.getAttribute('href'),
        rel: a.getAttribute('rel'),
        text: a.textContent,
      })),
    }))
    await nojs.page.screenshot({ path: `${OUT}/${label}-sem-js-390.png`, fullPage: true })
    for (const fact of [
      NAME,
      'Rua Valter Ribeiro Marrany, 275',
      'Vila Santa Maria',
      '04810-010',
      'São Paulo/SP',
      '(11) 5666-5036',
      'contato@impactoespeciais.com.br',
    ]) {
      check(fb.text.toLowerCase().includes(fact.toLowerCase()), `sem JS mostra "${fact}"`)
    }
    const fbHrefs = fb.links.map((l) => l.href)
    check(
      ALL_SLUGS.every((slug) => fbHrefs.includes(`${STORE}/${slug}/c`)) &&
        fbHrefs.filter((h) => h.endsWith('/c')).length === 19,
      `sem JS lista as 19 categorias com link real (${fbHrefs.filter((h) => h.endsWith('/c')).length})`,
    )
    check(fbHrefs.includes(STORE), 'sem JS tem o link da loja')
    check(fbHrefs.includes('tel:+551156665036'), 'sem JS tem o telefone com tel:')
    check(fbHrefs.includes('mailto:contato@impactoespeciais.com.br'), 'sem JS tem o e-mail com mailto:')
    check(
      fb.links.filter((l) => l.href.startsWith('http')).every((l) => l.rel === 'noopener noreferrer'),
      'sem JS: links externos com rel="noopener noreferrer"',
    )
    check(!/TODO/i.test(fb.text), 'sem JS nenhuma marca TODO')
    check(nojs.problems.length === 0, `sem JS sem erro de console/404 ${JSON.stringify(nojs.problems)}`)
    await nojs.ctx.close()
  } finally {
    await browser.close()
    server.kill()
  }
}

const build = (args, env) =>
  execSync(`node node_modules/vite/bin/vite.js build --emptyOutDir ${args} 2>&1`, {
    env: { ...process.env, ...env },
    encoding: 'utf8',
  })

// Sem VITE_SITE_URL: o build tem que avisar e não gerar og:image relativo
console.log('\n== build sem VITE_SITE_URL ==')
const noUrlLog = build('--outDir dist-semurl', { VITE_SITE_URL: '' })
const noUrlHtml = readFileSync('dist-semurl/index.html', 'utf8')
check(noUrlLog.includes('VITE_SITE_URL não definido'), 'build sem VITE_SITE_URL avisa no terminal')
check(!/og:image"|twitter:image"/.test(noUrlHtml), 'build sem VITE_SITE_URL não gera og:image/twitter:image')
check(!noUrlHtml.includes('content="/og.png"'), 'nenhuma URL relativa de imagem nas meta tags')
const badUrlLog = build('--outDir dist-semurl', { VITE_SITE_URL: 'impacto.vercel.app' })
check(badUrlLog.includes('VITE_SITE_URL inválido'), 'VITE_SITE_URL sem https:// também avisa')

build('--outDir dist-qa', { VITE_SITE_URL: QA_SITE_URL })
build('--mode proposta --outDir dist-proposta', { VITE_SITE_URL: QA_SITE_URL })
await run('producao', 'dist-qa', 4317, false)
await run('proposta', 'dist-proposta', 4318, true)

console.log(failures.length ? `\n${failures.length} falha(s).` : '\nTudo certo.')
process.exit(failures.length ? 1 : 0)
