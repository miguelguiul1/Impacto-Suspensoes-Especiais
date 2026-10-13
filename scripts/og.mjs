// Gera public/og.png (1200x630) a partir do próprio desenho do site.
// Uso: npm run build && node scripts/og.mjs
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const port = 4319
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--port', String(port), '--strictPort'],
  {
    stdio: ['ignore', 'pipe', 'inherit'],
  },
)
await new Promise((resolve) => server.stdout.on('data', (d) => String(d).includes(String(port)) && resolve()))

const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    bypassCSP: true,
    reducedMotion: 'reduce',
  })
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    const car = document.querySelector('#altura svg').outerHTML
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;display:grid;grid-template-columns:380px 1fr;background-color:rgb(var(--c-paper))" class="sheet-grid">
        <div style="padding:56px 0 48px 64px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="font-cond" style="font-size:64px;font-weight:800;line-height:.8;text-transform:uppercase">Impacto</div>
            <div class="font-cond" style="font-size:20px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;margin-top:8px">Suspensões Especiais</div>
          </div>
          <div class="font-cond" style="font-size:78px;font-weight:800;line-height:.86;text-transform:uppercase">Cada carro<br>tem a sua<br><span style="color:rgb(var(--c-red))">altura.</span></div>
          <div class="font-sans" style="font-size:20px;color:rgb(var(--c-muted))">Vila Santa Maria · São Paulo/SP</div>
        </div>
        <div style="display:flex;align-items:center;padding:0 40px 0 10px">${car}</div>
      </div>`
    document.querySelector('svg').setAttribute('style', 'width:100%;height:auto')
  })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: 'public/og.png' })
  console.log('public/og.png gerado')
} finally {
  await browser.close()
  server.kill()
}
