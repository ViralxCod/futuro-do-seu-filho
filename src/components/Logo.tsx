interface Props {
  size?: 'sm' | 'lg'
  iconOnly?: boolean
  className?: string
}

/** Logo O NINHO (inline, mesma arte de public/logo-ninho.svg). */
export function Logo({ size = 'sm', iconOnly = false, className = '' }: Props) {
  const h = size === 'lg' ? 88 : 44
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <svg height={h} viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <g stroke="#f0c75e" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M18 76 Q50 96 82 76" />
          <path d="M25 65 Q50 82 75 65" />
          <path d="M33 55 Q50 68 67 55" />
          <path d="M28 38 Q42 22 50 36 Q54 42 60 38 Q70 29 86 18 Q72 38 61 45 Q53 50 47 44 Q40 37 28 38 Z" strokeWidth="3.2" />
        </g>
      </svg>
      {!iconOnly && (
        <div className="text-left">
          <p className={`font-headline font-bold tracking-wider text-cream ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>O NINHO</p>
          <p className={`tracking-[0.35em] text-gold ${size === 'lg' ? 'text-[11px]' : 'text-[9px]'}`}>ÁREA DA MÃE PRESENTE</p>
        </div>
      )}
    </div>
  )
}
