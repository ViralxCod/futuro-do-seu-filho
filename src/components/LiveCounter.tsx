import { useEffect, useState } from 'react'

/**
 * "🟢 N mães fazendo o teste agora" — oscila entre 23 e 61 a cada 8–15s.
 * ⚠️ Número simulado (veja o aviso em src/config.ts sobre prova social).
 */
export function LiveCounter({ className = '' }: { className?: string }) {
  const [n, setN] = useState(() => 23 + Math.floor(Math.random() * 39))

  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(() => {
        if (!alive) return
        setN((prev) => {
          const delta = Math.floor(Math.random() * 7) - 3
          return Math.min(61, Math.max(23, prev + (delta === 0 ? 1 : delta)))
        })
        schedule()
      }, 8000 + Math.random() * 7000)
    }
    schedule()
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <p className={`flex items-center justify-center gap-2 text-[13px] text-fog ${className}`}>
      <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-mint" />
      <span>
        <strong className="text-gold">{n}</strong> mães fazendo o teste agora
      </span>
    </p>
  )
}
