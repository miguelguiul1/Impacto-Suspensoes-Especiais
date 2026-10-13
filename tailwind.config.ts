import type { Config } from 'tailwindcss'

/*
 * Cores: todas vêm das variáveis CSS em src/styles/index.css (um lugar só).
 * Quando a logo original chegar em /public/assets, troque os valores lá.
 *
 * Tipografia, por que essas duas:
 *
 * - Barlow Condensed (medidas e títulos): a Barlow foi desenhada a partir da
 *   sinalização pública da Califórnia — placa de estrada, placa de carro,
 *   letreiro pintado em chapa. É a mesma família visual da plaquinha de
 *   oficina e da cota escrita na prancha. Condensada, cabe "1,5"" e "32 mm"
 *   grandes sem estourar no celular, e os números têm desenho firme de régua.
 *
 * - IBM Plex Sans (texto corrido): nasceu dentro de uma empresa de engenharia
 *   para documentação técnica; tem algarismos tabulares, acentuação boa em
 *   português e lê bem em tamanho pequeno. Tem cara de ficha técnica sem ser
 *   fria, e não disputa atenção com a Barlow nos números.
 *
 * As duas são servidas do próprio site (@fontsource), sem chamar o Google
 * Fonts: nenhum IP de visitante vai para terceiro só para carregar fonte.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        'paper-2': 'rgb(var(--c-paper-2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        red: 'rgb(var(--c-red) / <alpha-value>)',
        sky: 'rgb(var(--c-sky) / <alpha-value>)',
      },
      fontFamily: {
        cond: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        ruler: 'var(--ruler-w)',
      },
    },
  },
  plugins: [],
} satisfies Config
