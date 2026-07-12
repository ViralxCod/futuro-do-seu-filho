# Funil Gamificado — "O Futuro do Seu Filho"

SPA mobile-first (Vite + React + TypeScript + Tailwind + Framer Motion + Zustand).

## Rodar local

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes da pontuação (perfis + empates)
npm run build      # build de produção (dist/)
npm run preview    # testa o build localmente
```

## Deploy na Vercel (1 comando)

```bash
npx vercel --prod
```

(Na primeira vez ele pede login e confirma o projeto — o `vercel.json` já cuida do rewrite de SPA.)

## Configurar ANTES do lançamento — tudo em `src/config.ts`

1. **Checkout**: cole as URLs dos 2 produtos (Kiwify/Hotmart/Stripe):
   - Mapa R$ 19,99 → URL de retorno no gateway: `https://SEUDOMINIO/obrigada?paid=1`
   - Manual R$ 27 → URL de retorno no gateway: `https://SEUDOMINIO/mapa?paid2=1`
   - Com as URLs vazias o funil roda em **modo teste** (simula o pagamento).
2. **Pixels**: `metaPixelId` e `tiktokPixelId`.
3. **⚠️ Prova social**: os depoimentos e o contador "+14.320 mães" vieram da copy como
   exemplos e são **fictícios**. Substitua por depoimentos reais (com autorização) e
   números reais antes de rodar tráfego — depoimento inventado é propaganda enganosa
   (CDC art. 37) e derruba conta de anúncio no Meta/TikTok.

## Vídeos (gerar no Flik AI)

Os roteiros completos, cena por cena, estão na seção "🎬 ROTEIROS DE VÍDEO" do arquivo
`funil-gamificado-futuro-do-filho.md`. Exporte em **9:16, MP4**:

| Arquivo | Onde colocar | Onde aparece |
|---|---|---|
| `video3.mp4` | `public/` | Página inicial (autoplay mudo — legendar TUDO) |
| `video4.mp4` | `public/` | Oferta R$ 19,99 |
| `video5.mp4` | `public/` | Upsell R$ 27 |
| `video1.mp4`, `video2.mp4` | raiz do projeto | Criativos de anúncio (não entram no site) |

Use a MESMA personagem (mãe ~35 anos, brasileira) nos vídeos 1, 4 e 5.
Enquanto os arquivos não existirem, o site mostra um placeholder elegante.

## Conteúdo do produto

O conteúdo entregue no `/mapa` (ponto cego por extenso, projeção ano a ano, Manual)
está em `src/data/entrega.ts`, todo marcado com `// TODO: conteúdo final do produto`
e `[PLACEHOLDER]`. Substitua pelo material real antes de vender.

## Como funciona o contador de 15:00

O contador começa quando ela vê o `/resultado`, persiste no localStorage (sobrevive a
refresh) e é **real**: quando zera sem pagamento, respostas e perfil são apagados e o
quiz recomeça — exatamente o que a copy promete. Quem pagou não perde o acesso.

## Verificação de pagamento

Nesta versão: query param no retorno do gateway (`?paid=1` / `?paid2=1`) + localStorage.
Os pontos onde entrará a validação server-side futura (webhook do gateway) estão
comentados em `src/config.ts`, `src/pages/Obrigada.tsx` e `src/pages/Mapa.tsx`.
