# Impacto Suspensões Especiais — site de apresentação (protótipo)

Porta de entrada da marca. O site não vende e não tem carrinho: o visitante sobe e
desce o carro no desenho, vê qual linha de suspensão combina com o jeito dele de
andar e cai na categoria certa da loja virtual (ou liga pra Impacto).

Conceito: **Cada carro tem a sua altura.**

## Rodar

```bash
npm install
npm run dev            # site como vai pro ar (sem marcas TODO)
npm run dev:proposta   # modo proposta: mostra TODO-CONFIRMAR e a seção Track Day
```

Build e checagens:

```bash
npm run build          # tsc + vite build → dist/
npm run lint
npm test               # testes do montador de link do WhatsApp
npm run qa             # build da proposta + testes no navegador + screenshots em qa-output/
npm run og             # regenera public/og.png a partir do desenho (rodar depois do build)
```

`npm run qa` usa o Playwright. Numa máquina nova: `npx playwright install chromium`.

## Variáveis de ambiente

Veja `.env.example`. Nenhuma chave, token ou senha vai pro repositório.

| Variável | Para quê |
| --- | --- |
| `VITE_PROPOSAL_MODE` | `true` mostra as marcas TODO-CONFIRMAR e o que depende do dono. Sem ela, nada disso aparece. |
| `VITE_WHATSAPP_NUMBER` | Só depois de confirmado. `55` + DDD + número. Liga o botão de WhatsApp no controle e no contato. |
| `VITE_SITE_URL` | URL pública (ex.: `https://impacto.vercel.app`) para `og:image` e `og:url` absolutos e `url` no JSON-LD. |

## Deploy (Vercel)

Importar o repositório na Vercel; `vercel.json` já define build, saída e os
cabeçalhos de segurança (CSP, X-Content-Type-Options, Referrer-Policy,
X-Frame-Options, Permissions-Policy, X-Robots-Tag noindex). Para a versão de
apresentação ao dono, configurar `VITE_PROPOSAL_MODE=true` no ambiente de Preview.

## Onde mexer

- `src/data/site.ts` — fatos confirmados (endereço, telefone, e-mail, Instagram, loja).
- `src/data/categories.ts` — as 19 categorias reais e o slug de cada uma.
- `src/data/bands.ts` — as 4 faixas de altura e quais categorias cada uma mostra.
- `src/data/dicas.ts` — posts reais de dicas. Vazio = a seção não existe.
- `src/styles/index.css` — **cores num lugar só** (vermelho e preto provisórios até a logo chegar).
- `tailwind.config.ts` — fontes e o porquê de cada uma.
- `src/components/Wordmark.tsx` — wordmark em texto até a logo original chegar.

## Regras do projeto

- Nada fora dos fatos confirmados aparece como verdade. Dado não confirmado ou
  não aparece, ou leva `<Todo>` (visível só no modo proposta).
- Textos descrevem só o uso. Nada de desempenho, garantia, altura mínima ou homologação.
- Links externos sempre com `rel="noopener noreferrer"`. Texto que vai para URL do
  WhatsApp passa por validação e `encodeURIComponent` (`src/lib/whatsapp.ts`).
- O protótipo não coleta dado pessoal. Se um dia houver formulário com banco
  (Supabase): RLS ligada, visitante só insere e nunca lê, validação no servidor,
  aviso de privacidade (LGPD) antes de guardar.
- Fotos e vídeos, quando chegarem: sem EXIF/GPS, placas, rostos de terceiros e
  marcas de outras empresas borrados, ninguém sem autorização; WebP/AVIF com
  `loading="lazy"`; vídeo do topo até ~3 MB.
