import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { config, openCheckout } from '../config'
import { useFunnel } from '../store'
import { track } from '../lib/tracking'

// Etapa final do funil — upsell "O Ninho Completo" (R$ 67,55), DEPOIS do
// Manual e ANTES de exibir o Mapa. Bloco de venda em copy (sem vídeo).
const stack = [
  {
    emoji: '🎥',
    title: 'Programa "21 Dias Sem Grito" em vídeo',
    text: 'uma aula curta por dia, no seu ritmo, pra sair do ciclo do grito e reconstruir o vínculo — do "enxergar o padrão" ao "consolidar a mudança"',
  },
  {
    emoji: '📚',
    title: 'Biblioteca de Roteiros de Crise',
    text: 'o que fazer e o que falar em cada situação: birra em público, hora de dormir, telas, manhã corrida, "eu te odeio, mãe", ciúme de irmão e mais',
  },
  {
    emoji: '💯',
    title: 'Score de Conexão acompanhado',
    text: 'sua bússola de progresso de 0 a 100 — você vê a conexão com seu filho subindo semana a semana',
  },
  {
    emoji: '🔄',
    title: 'Acesso vitalício + atualizações',
    text: 'tudo dentro d’O Ninho, pra rever quantas vezes precisar, sempre que a rotina apertar',
  },
]

export function Completo() {
  const navigate = useNavigate()
  const paidMapa = useFunnel((s) => s.paidMapa)
  const markCompletoSeen = useFunnel((s) => s.markCompletoSeen)

  useEffect(() => {
    if (!paidMapa) {
      navigate('/desbloquear', { replace: true })
      return
    }
    track('completo_visto')
  }, [])

  const buy = () => {
    track('checkout_completo_iniciado')
    openCheckout('completo')
  }
  const no = () => {
    markCompletoSeen()
    navigate('/mapa')
  }

  if (!paidMapa) return null

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-14 pt-8">
      <p className="mx-auto w-fit rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-[11px] font-bold tracking-widest text-gold">
        ÚLTIMO PASSO • OFERTA ÚNICA
      </p>

      <h1 className="mt-4 text-center text-[24px] font-bold leading-tight">
        Você já tem o mapa e o manual. Falta o que sustenta a mudança <span className="hl">nos 21 dias mais difíceis.</span>
      </h1>

      <p className="mt-6 text-[15px] leading-relaxed text-fog">
        Ler o que fazer é uma coisa. Conseguir fazer — todo dia, às 18h, cansada — é outra. O{' '}
        <strong className="text-gold">Ninho Completo</strong> é o acompanhamento que segura sua mão nesse período: um
        passo por dia, com o roteiro certo pra cada crise, até a calma virar o seu novo normal.
      </p>

      <h2 className="mt-8 font-headline text-xl font-bold text-gold">O que você leva ao desbloquear agora:</h2>
      <div className="mt-4 space-y-4">
        {stack.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gold/25 bg-night-card p-4 shadow-lg">
            <p className="text-[15px] leading-snug text-cream">
              {s.emoji} <strong className="text-gold">{s.title}</strong> — {s.text}
            </p>
          </div>
        ))}
      </div>

      {/* Ancoragem de preço */}
      <div className="mt-8 text-center">
        <p className="text-fog">
          <s className="opacity-70">De {config.checkout.completo.anchorPrice}</s> por apenas:
        </p>
        <p className="font-headline text-6xl font-bold text-gold drop-shadow-[0_0_20px_rgba(240,199,94,0.4)]">
          {config.checkout.completo.price}
        </p>
        <p className="mt-2 text-[14px] text-mint">✓ Acesso imediato, no mesmo e-mail da sua compra</p>
      </div>

      <button onClick={buy} className="cta mt-6 py-5">
        ✅ SIM — QUERO O NINHO COMPLETO (por R$ 67,55) →
      </button>

      <button
        onClick={no}
        className="mt-5 w-full text-center text-[12px] italic text-white/35 underline underline-offset-2"
      >
        Não, obrigada. Quero apenas ver o meu Mapa agora. (Esta oferta não aparece de novo.)
      </button>

      <p className="mt-7 rounded-2xl bg-cream p-5 text-[14px] leading-relaxed text-cocoa">
        As mães que mais se transformam não são as que sabem o que fazer — são as que têm alguém do lado nos 21 dias em
        que a mudança ainda é difícil. É exatamente isso que O Ninho Completo te dá.
      </p>
    </motion.main>
  )
}
