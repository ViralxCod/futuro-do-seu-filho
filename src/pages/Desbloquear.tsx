import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { WhatsAppPrints } from '../components/WhatsAppPrints'
import { TimerCard } from '../components/TimerCard'
import { LiveCounter } from '../components/LiveCounter'
import { CountdownTimer } from '../components/CountdownTimer'
import { MAPA_PRICE, openCheckout } from '../config'
import { useFunnel } from '../store'
import { track } from '../lib/tracking'

// O QUE VOCÊ RECEBE HOJE — cada item com preço "de" riscado para ancorar valor.
const stack = [
  { title: 'O Mapa do seu filho', text: 'o resultado completo do seu teste', from: 'R$47' },
  { title: 'Guia "Os 5 Gatilhos das 18h"', text: 'o que dispara o grito no fim do dia — e como desarmar antes', from: 'R$37' },
  { title: '3 Áudios "Primeiro Socorro no Grito"', text: 'pra ouvir no exato momento em que a raiva começa a subir', from: 'R$29' },
  { title: 'Termômetro do Corpo', text: 'reconhecer a raiva no corpo antes de explodir', from: 'R$24' },
  { title: 'Roteiro da Reparação', text: 'o que dizer depois do grito pra reconstruir a conexão', from: 'R$22' },
  { title: 'Checklist "Palavras que Curam × Ferem"', text: 'a lista pra deixar na geladeira e consultar no calor da hora', from: 'R$19' },
  { title: 'A Regra dos 3 Passos', text: 'a técnica de 20 segundos pra sair do piloto automático', from: 'R$17' },
]

const faq = [
  { q: 'Isso é uma previsão exata do futuro?', a: 'Não — e desconfie de quem prometer isso. O Mapa identifica tendências comportamentais baseadas em padrões de criação amplamente estudados. O futuro do seu filho não está escrito: é exatamente por isso que o Mapa existe.' },
  { q: 'Serve para filhos de qualquer idade?', a: 'O Mapa é calibrado para mães de crianças de 2 a 12 anos — a janela em que os ajustes têm maior efeito.' },
  { q: 'Recebo na hora?', a: 'Sim. O Mapa é liberado na tela e enviado ao seu e-mail imediatamente após o pagamento.' },
  { q: 'E se eu não gostar?', a: '7 dias de garantia incondicional. Um e-mail e devolvemos tudo.' },
]

export function Desbloquear() {
  const navigate = useNavigate()
  const profile = useFunnel((s) => s.profile)

  useEffect(() => {
    if (!profile) navigate('/', { replace: true })
  }, [profile, navigate])

  const buy = () => {
    track('checkout_1999_iniciado')
    openCheckout('mapa')
  }

  if (!profile) return null

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="app-col min-h-dvh px-5 pb-14 pt-0">
      <TimerCard />

      <h1 className="pt-5 text-center text-[26px] font-bold leading-tight">
        Você já viu o Mapa. Agora, o passo a passo pra <span className="hl">sair do ciclo</span> — por menos que um lanche.
      </h1>

      <p className="mt-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-center text-[15px] font-bold text-gold">
        Dome a birra sem gritar — e sem a culpa depois.
      </p>

      <LiveCounter className="mt-3" />

      <p className="mt-6 text-[15px] leading-relaxed text-fog">
        O Mapa te mostrou o que acontece. O que vem agora é o alívio: um caminho simples, passo a passo, pra você
        interromper o grito antes que ele comece — e reconstruir a conexão nos dias em que ele escapar. Nada de teoria.
        Só o que fazer, na ordem certa, a partir de hoje.
      </p>

      <p className="mt-5 rounded-2xl bg-cream p-5 text-[15px] leading-relaxed text-cocoa">
        Entenda uma coisa: <strong>sair do ciclo não é sobre virar uma mãe perfeita.</strong> Você jura de manhã que vai
        ser paciente e explode às 18h não porque é fraca — mas porque está exausta, sem manual e, na maioria dos dias,
        sozinha. Isto aqui é o manual que nunca te deram. Um passo de cada vez, você volta a se reconhecer.
      </p>

      <h2 className="mt-8 font-headline text-xl font-bold text-gold">O QUE VOCÊ RECEBE HOJE</h2>
      <div className="mt-4 space-y-3">
        {stack.map((s, i) => (
          <div key={i} className="flex items-start justify-between gap-3 rounded-2xl border border-gold/25 bg-night-card p-4 shadow-lg">
            <p className="text-[15px] leading-snug text-cream">
              <strong className="text-gold">{s.title}</strong> — {s.text}
            </p>
            <span className="mt-0.5 shrink-0 text-[14px] text-fog">
              de <s className="opacity-70">{s.from}</s>
            </span>
          </div>
        ))}
      </div>

      {/* Fechamento do stack + ancoragem: total riscado, preço final dourado grande */}
      <div className="mt-6 text-center">
        <p className="text-[16px] text-cream">
          Tudo isso: <s className="text-fog opacity-70">R$195</s>
        </p>
        <p className="mt-4 font-headline text-6xl font-bold text-gold drop-shadow-[0_0_20px_rgba(240,199,94,0.4)]">
          {MAPA_PRICE}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-cream">
          Hoje, por {MAPA_PRICE} — pagamento único, acesso na hora.
        </p>
        <p className="mt-2 text-[14px] italic text-fog">
          Menos que um lanche — pra sair do ciclo e voltar a se reconhecer.
        </p>
      </div>

      <button onClick={buy} className="cta mt-6">
        Quero sair do ciclo — {MAPA_PRICE} →
      </button>

      {/* Garantia Arrepio — ícone SVG limpo, sem emoji */}
      <div className="mt-8 flex gap-4 rounded-2xl border border-gold/40 bg-night-card p-5 shadow-lg">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="shrink-0 drop-shadow-[0_0_10px_rgba(240,199,94,0.45)]" aria-hidden="true">
          <circle cx="24" cy="24" r="21" stroke="#f0c75e" strokeWidth="2.5" />
          <path d="M15 24.5 L21 30.5 L33 17.5" stroke="#f0c75e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div>
          <h3 className="font-headline text-lg font-bold text-gold">
            Garantia de 7 dias — se não te ajudar, seu dinheiro volta.
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-cream">
            Aplique o passo a passo. Se em 7 dias você não sentir o clima em casa começar a mudar, um clique e
            devolvemos 100%. Sem perguntas, sem enrolação. O risco é todo nosso.
          </p>
        </div>
      </div>

      {/* Depoimentos: prints de WhatsApp (entre a garantia e o CTA final) */}
      <div className="mt-6">
        <WhatsAppPrints />
      </div>

      <p className="mt-7 rounded-xl border border-coral/40 bg-coral/10 p-4 text-center text-[14px] italic text-cream">
        ⏱️ Seu resultado expira em <CountdownTimer className="not-italic text-coral" />. Depois disso, as respostas são
        apagadas e o quiz precisa ser refeito.
      </p>

      <button onClick={buy} className="cta mt-6">
        Quero sair do ciclo — {MAPA_PRICE} →
      </button>

      <h2 className="mt-10 font-headline text-xl font-bold text-gold">Perguntas frequentes</h2>
      <div className="mt-4 space-y-4">
        {faq.map((f, i) => (
          <div key={i} className="rounded-2xl bg-night-card p-4">
            <p className="text-[15px] font-bold text-cream">{f.q}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-fog">{f.a}</p>
          </div>
        ))}
      </div>
    </motion.main>
  )
}
