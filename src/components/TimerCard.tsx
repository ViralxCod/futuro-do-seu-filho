import { useFunnel } from '../store'
import { genderOf } from '../lib/personalize'
import { CountdownTimer } from './CountdownTimer'

/** Card coral fixo no topo com o contador e o nome do filho. */
export function TimerCard() {
  const child = useFunnel((s) => s.child)
  const deadline = useFunnel((s) => s.deadline)
  const paidMapa = useFunnel((s) => s.paidMapa)
  if (!deadline || paidMapa) return null

  const g = genderOf(child)
  const label = child?.name ? `O Mapa d${g.o} ${child.name} expira em` : 'O seu Mapa expira em'

  return (
    <div className="sticky top-0 z-50 -mx-5 mb-4 bg-gradient-to-r from-coral to-coral-deep px-5 py-2.5 text-center text-[14px] font-bold text-white shadow-lg">
      ⏱️ {label} <CountdownTimer className="text-white" />
    </div>
  )
}
