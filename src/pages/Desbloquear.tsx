import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { WhatsAppPrints } from '../components/WhatsAppPrints'
import { TimerCard } from '../components/TimerCard'
import { LiveCounter } from '../components/LiveCounter'
import { CountdownTimer } from '../components/CountdownTimer'
import { config, openCheckout } from '../config'
import { useFunnel } from '../store'
import { track } from '../lib/tracking'
import { genderOf, fill } from '../lib/personalize'

const stack = [
  { emoji: '📍', title: 'O Ponto Cego Revelado', text: 'o padrão exato detectado nas suas respostas dos Blocos 2 e 4, por extenso, sem tarja', value: '(valor: R$ 47)' },
  { emoji: '📈', title: 'Projeção Ano a Ano', text: 'o retrato do seu filho aos 7, 14, 18 e 25 anos com o padrão atual — e a versão dele se você corrigir agora', value: '(valor: R$ 67)' },
  { emoji: '💯', title: 'Seu Score de Conexão', text: 'sua pontuação de 0 a 100 comparada com a média das mães do seu perfil', value: '(valor: R$ 47)' },
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
  const child = useFunnel((s) => s.child)
  const g = genderOf(child)

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
        Seu Mapa está pronto. Falta só você ter <span className="hl">coragem de olhar.</span>
      </h1>

      <LiveCounter className="mt-3" />

      <p className="mt-6 text-[15px] leading-relaxed text-fog">
        Você respondeu com honestidade. O sistema cruzou suas 12 respostas e o resultado está montado na próxima tela: o
        ponto cego completo, a projeção do seu filho aos 7, 14, 18 e 25 anos, e o seu Score de Conexão. Tudo baseado no
        que VOCÊ respondeu — não em teoria genérica.
      </p>

      <p className="mt-5 rounded-2xl bg-cream p-5 text-[15px] leading-relaxed text-cocoa">
        Antes de continuar, entenda uma coisa: <strong>nenhum ponto cego faz de você uma mãe ruim.</strong> Você jura de
        manhã que vai ser paciente e explode às 18h não porque é fraca — mas porque está exausta, sem manual e, na
        maioria dos dias, sozinha. O Mapa não existe para te julgar. Existe para te dar o que nunca te deram:{' '}
        <strong>clareza.</strong>
      </p>

      <h2 className="mt-8 font-headline text-xl font-bold text-gold">Ao desbloquear agora, você vê na tela:</h2>
      <div className="mt-4 space-y-4">
        {stack.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gold/25 bg-night-card p-4 shadow-lg">
            <p className="text-[15px] leading-snug text-cream">
              {s.emoji} <strong className="text-gold">{s.title}</strong> — {s.text} <em className="text-fog">{s.value}</em>
            </p>
          </div>
        ))}
      </div>

      {/* Ancoragem: riscado cinza, preço final dourado grande */}
      <div className="mt-8 text-center">
        <p className="text-fog">
          <s className="opacity-70">De {config.checkout.mapa.anchorPrice}</s> por apenas:
        </p>
        <p className="font-headline text-6xl font-bold text-gold drop-shadow-[0_0_20px_rgba(240,199,94,0.4)]">
          {config.checkout.mapa.price}
        </p>
        <p className="mt-2 text-[14px] italic text-fog">
          Menos que um lanche no shopping — pelo retrato de quem seu filho está se tornando.
        </p>
      </div>

      <button onClick={buy} className="cta mt-6">
        🔓 VER MEU RESULTADO COMPLETO AGORA — R$ 19,99 →
      </button>

      {/* Garantia Arrepio — ícone SVG limpo, sem emoji */}
      <div className="mt-8 flex gap-4 rounded-2xl border border-gold/40 bg-night-card p-5 shadow-lg">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="shrink-0 drop-shadow-[0_0_10px_rgba(240,199,94,0.45)]" aria-hidden="true">
          <circle cx="24" cy="24" r="21" stroke="#f0c75e" strokeWidth="2.5" />
          <path d="M15 24.5 L21 30.5 L33 17.5" stroke="#f0c75e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div>
          <h3 className="font-headline text-lg font-bold text-gold">
            {fill('Garantia Arrepio: se o Mapa não descrever {o} {NOME} com uma precisão que te arrepie, você não paga.', child)}
          </h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-cream">
            Leia tudo. Se em 7 dias você não olhar pro seu filho — e pra você mesma — de um jeito diferente, um clique e
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
        🔓 DESBLOQUEAR O FUTURO D{g.o.toUpperCase()} {child?.name ? child.name.toUpperCase() : 'MEU FILHO'} — R$ 19,99 →
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
