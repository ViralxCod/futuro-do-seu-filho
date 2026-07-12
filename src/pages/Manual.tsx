import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { config, openCheckout } from '../config'
import { useFunnel } from '../store'
import { track } from '../lib/tracking'

const stack = [
  { emoji: '🕯️', title: 'O Ritual dos 10 Minutos Depois', text: 'o protocolo de reparação pós-explosão: o que falar, o que nunca falar, passo a passo', value: '(valor: R$ 37)' },
  { emoji: '⚖️', title: 'O Critério Anti-Paralisia', text: 'a régua simples que responde de uma vez: "isso vai traumatizar ou isso é limite necessário?"', value: '(valor: R$ 47)' },
  { emoji: '🗣️', title: 'Guia "As 12 Frases que Programam o Futuro"', text: 'o que dizer (e o que nunca dizer) na birra, no erro, no "eu te odeio, mãe"', value: '(valor: R$ 29)' },
  { emoji: '🎁', title: 'Bônus: Plano de 30 Dias do Score', text: 'o caminho para subir 20 pontos no seu Score de Conexão em um mês', value: '(valor: R$ 27)' },
]

/** Etapa 4B — upsell R$ 27, DEPOIS do pagamento 1 e ANTES de exibir o Mapa. */
export function Manual() {
  const navigate = useNavigate()
  const paidMapa = useFunnel((s) => s.paidMapa)
  const declineUpsell = useFunnel((s) => s.declineUpsell)

  useEffect(() => {
    if (!paidMapa) {
      navigate('/desbloquear', { replace: true })
      return
    }
    track('upsell_visto')
  }, [])

  const yes = () => openCheckout('manual')
  const no = () => {
    declineUpsell()
    navigate('/mapa')
  }

  if (!paidMapa) return null

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-14 pt-8">
      <h1 className="text-center text-[24px] font-bold leading-tight">
        Espera. Seu Mapa mostra ONDE está o problema. Ele não mostra o que fazer <span className="hl">amanhã às 18h.</span>
      </h1>

      <p className="mt-6 text-[15px] leading-relaxed text-fog">
        Em 30 segundos você vai ler seu ponto cego — e a primeira pergunta que vai gritar na sua cabeça é:{' '}
        <em>"tá, e AGORA? O que eu faço?"</em> A resposta está no{' '}
        <strong className="text-gold">Manual da Mãe Presente</strong>: o passo a passo prático para agir diferente já
        amanhã, nas situações exatas que você confessou no teste.
      </p>

      <h2 className="mt-8 font-headline text-xl font-bold text-gold">Só nesta tela, você adiciona ao seu Mapa:</h2>
      <div className="mt-4 space-y-4">
        {stack.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gold/25 bg-night-card p-4 shadow-lg">
            <p className="text-[15px] leading-snug text-cream">
              {s.emoji} <strong className="text-gold">{s.title}</strong> — {s.text} <em className="text-fog">{s.value}</em>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-fog">
          <s className="opacity-70">De {config.checkout.manual.anchorPrice}</s> por apenas:
        </p>
        <p className="font-headline text-6xl font-bold text-gold drop-shadow-[0_0_20px_rgba(240,199,94,0.4)]">+ R$ 27</p>
        <p className="mt-2 text-[14px] text-mint">✓ Em um clique — sem digitar o cartão de novo</p>
      </div>

      <button onClick={yes} className="cta mt-6 py-5">
        ✅ SIM — QUERO O MAPA + O MANUAL (adicionar por R$ 27) →
      </button>

      {/* Botão-não: texto cinza pequeno (custo psicológico de recusar) */}
      <button onClick={no} className="mt-5 w-full text-center text-[12px] italic text-white/35 underline underline-offset-2">
        Não, obrigada. Quero apenas ver o diagnóstico, sem o passo a passo prático. (Esta oferta não aparece de novo.)
      </button>

      <p className="mt-7 rounded-2xl bg-cream p-5 text-[14px] leading-relaxed text-cocoa">
        As mães que mais se transformam não são as que LEEM o ponto cego. São as que sabem o que fazer na próxima birra,
        no próximo grito, no próximo "eu te odeio". O Mapa te mostra o espelho. O Manual te entrega a saída.
      </p>
    </motion.main>
  )
}
