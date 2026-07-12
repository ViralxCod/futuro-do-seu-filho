import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LiveCounter } from '../components/LiveCounter'
import { Logo } from '../components/Logo'
import { config } from '../config'
import { track } from '../lib/tracking'

const bullets = [
  { emoji: '🧠', text: <>Descubra qual dos <strong className="text-gold">4 Perfis de Futuro</strong> seu filho está desenvolvendo agora — com base em como VOCÊ age, não no que você planeja</> },
  { emoji: '👀', text: <>Veja o <strong className="text-gold">ponto cego</strong> que 8 em cada 10 mães não percebem na própria rotina (e que aparece nele aos 14 anos)</> },
  { emoji: '⏱️', text: <>Leva menos de 3 minutos — e o resultado pode mudar a forma como você age hoje e evitar o erro no futuro do seu filho ou filha</> },
]

export function Landing() {
  const navigate = useNavigate()

  const start = () => {
    track('quiz_start')
    navigate('/quiz')
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="app-col min-h-dvh px-5 pb-12 pt-6">
      <Logo className="mb-4" />

      {/* Chip de autoridade */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-fit rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-center text-[11px] font-bold tracking-widest text-gold"
      >
        ANÁLISE COMPORTAMENTAL • 2 A 12 ANOS
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mt-4 text-center text-[26px] font-bold leading-tight"
      >
        Você jura toda manhã que hoje vai ser paciente. Aí dá 18h... e você vira <span className="hl">alguém que você mesma odeia.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-center text-[15px] leading-relaxed text-fog"
      >
        Quem você está criando hoje: o adulto que vai te agradecer — ou o que vai carregar os seus erros? Responda 12
        perguntas rápidas sobre o seu dia a dia e <span className="hl font-bold">veja o futuro do seu filho</span> antes
        que seja tarde para mudá-lo.
      </motion.p>

      {/* CTA na primeira dobra */}
      <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={start} className="cta mt-5">
        🔓 DESCOBRIR O FUTURO DO MEU FILHO →
      </motion.button>
      <p className="mt-2.5 text-center text-xs text-fog">🔒 Suas respostas são 100% anônimas e confidenciais</p>
      <p className="mt-1.5 text-center text-xs text-fog">
        <span className="font-bold text-mint">✓ Gratuito para começar</span>&nbsp;&nbsp;✓ 3 minutos&nbsp;&nbsp;✓{' '}
        <span className="text-gold">{config.socialProof.quizTakenCount}</span>
      </p>
      <LiveCounter className="mt-3" />

      <ul className="mt-7 space-y-4">
        {bullets.map((b, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex gap-3 rounded-2xl bg-night-card/70 p-4 text-[14px] leading-snug text-cream"
          >
            <span className="text-xl">{b.emoji}</span>
            <span>{b.text}</span>
          </motion.li>
        ))}
      </ul>

      {/* Box de reciprocidade-humor */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-center text-[14px] leading-relaxed text-cream"
      >
        ⚠️ Aviso: se depois do resultado você olhar para o seu filho de outro jeito hoje à noite... a gente aceita um
        obrigada.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="mt-5 rounded-2xl bg-cream p-4 text-center font-headline text-[15px] italic leading-relaxed text-cocoa"
      >
        Se você já chorou baixinho olhando ele dormir, pedindo perdão em silêncio pelo grito de mais cedo... este teste
        foi feito para você.
      </motion.p>

      <p className="mt-8 border-t border-white/10 pt-5 text-center text-[13px] leading-relaxed text-fog">
        {config.socialProof.landingReview}
      </p>
    </motion.main>
  )
}
