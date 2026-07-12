import { useMemo } from 'react'

const COLORS = ['#f0c75e', '#d9a63a', '#fff2c9', '#ff6b5e']

/** Micro-confete dourado em CSS puro (~1s, discreto). */
export function Confetti({ count = 18 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 60 - 30,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, background: p.color, transform: `rotate(${p.rot}deg)` }}
        />
      ))}
    </div>
  )
}
