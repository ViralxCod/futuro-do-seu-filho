import { motion } from 'framer-motion'
import { useFunnel } from '../store'
import { questions } from '../data/quiz'

const AXES = ['Rotina', 'Reações', 'Conexão', 'Visão']
const SIZE = 46
const C = SIZE / 2
const R = C - 4

/**
 * Radar 4 eixos (Rotina/Reações/Conexão/Visão) — cresce a cada resposta
 * do bloco atual. Fica fixo no cabeçalho do quiz, ao lado da barra.
 */
export function Radar() {
  const answers = useFunnel((s) => s.answers)

  // respostas por bloco (0..3) → fração do raio
  const counts = [1, 2, 3, 4].map(
    (b) => questions.filter((q) => q.block === b && answers[q.id]).length / 3,
  )

  const pt = (i: number, frac: number) => {
    const ang = (Math.PI / 2) * i - Math.PI / 2
    const r = R * (0.18 + 0.82 * frac)
    return [C + r * Math.cos(ang), C + r * Math.sin(ang)]
  }

  const d =
    counts
      .map((f, i) => {
        const [x, y] = pt(i, f)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ') + ' Z'

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label={`Análise: ${AXES.join(', ')}`}>
      {/* grade */}
      {[0.5, 1].map((f) => (
        <polygon
          key={f}
          points={[0, 1, 2, 3]
            .map((i) => {
              const ang = (Math.PI / 2) * i - Math.PI / 2
              return `${C + R * f * Math.cos(ang)},${C + R * f * Math.sin(ang)}`
            })
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
        />
      ))}
      {[0, 1, 2, 3].map((i) => {
        const ang = (Math.PI / 2) * i - Math.PI / 2
        return <line key={i} x1={C} y1={C} x2={C + R * Math.cos(ang)} y2={C + R * Math.sin(ang)} stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
      })}
      {/* área da análise */}
      <motion.path
        animate={{ d }}
        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        fill="rgba(240,199,94,0.35)"
        stroke="#f0c75e"
        strokeWidth={1.5}
      />
    </svg>
  )
}
