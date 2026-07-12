import { useEffect, useState } from 'react'
import { useFunnel } from '../store'
import { useNavigate } from 'react-router-dom'

/**
 * Contador de 15:00 persistido em localStorage (sobrevive a refresh).
 * Últimos 60s em vermelho pulsando. Quando zera, o resultado é
 * apagado DE VERDADE (a promessa da copy é real) e volta para o início.
 */
export function CountdownTimer({ className = '' }: { className?: string }) {
  const deadline = useFunnel((s) => s.deadline)
  const paidMapa = useFunnel((s) => s.paidMapa)
  const expire = useFunnel((s) => s.expire)
  const navigate = useNavigate()
  const [remaining, setRemaining] = useState(() => (deadline ? deadline - Date.now() : 0))

  useEffect(() => {
    if (!deadline || paidMapa) return
    const tick = () => {
      const left = deadline - Date.now()
      setRemaining(left)
      if (left <= 0) {
        expire()
        navigate('/', { replace: true })
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline, paidMapa, expire, navigate])

  if (!deadline || paidMapa) return null

  const totalSec = Math.max(0, Math.floor(remaining / 1000))
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const ss = String(totalSec % 60).padStart(2, '0')
  const urgent = totalSec <= 60

  return (
    <span className={`inline-block font-mono font-bold tabular-nums ${urgent ? 'timer-urgent' : ''} ${className}`}>
      {mm}:{ss}
    </span>
  )
}
