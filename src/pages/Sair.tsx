import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'

/**
 * Opt-out (LGPD) — a Leona envia o link ?leadId=... nas mensagens de
 * recuperação. Aqui a mãe pode sair da lista com um clique.
 */
export function Sair() {
  const [params] = useSearchParams()
  const leadId = params.get('leadId')
  const [state, setState] = useState<'idle' | 'ok' | 'erro' | 'semid'>('idle')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!leadId) setState('semid')
  }, [leadId])

  const sair = async () => {
    if (!leadId || !supabase) return
    setBusy(true)
    const { error } = await supabase.rpc('lead_opt_out', { lead_id: leadId })
    setBusy(false)
    setState(error ? 'erro' : 'ok')
  }

  return (
    <main className="app-col flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <Logo />
      {state === 'ok' ? (
        <p className="mt-8 text-[16px] leading-relaxed text-cream">
          Pronto 💛 Você não vai mais receber nossas mensagens. Cuide-se — e, se um dia precisar, a porta continua
          aberta.
        </p>
      ) : state === 'semid' ? (
        <p className="mt-8 text-[15px] text-fog">Link inválido. Se quiser sair da lista, responda a última mensagem que recebeu.</p>
      ) : state === 'erro' ? (
        <p className="mt-8 text-[15px] text-coral">Não consegui concluir agora. Tente de novo em instantes.</p>
      ) : (
        <>
          <p className="mt-8 text-[16px] leading-relaxed text-cream">
            Quer parar de receber as mensagens de acompanhamento?
          </p>
          <button onClick={sair} disabled={busy} className="cta mt-6 disabled:opacity-50">
            {busy ? 'Saindo...' : 'Sim, não quero mais receber'}
          </button>
        </>
      )}
    </main>
  )
}
