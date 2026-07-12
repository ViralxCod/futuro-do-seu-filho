import { lockedSection } from '../data/profiles'

// Texto FAKE por baixo do blur — o conteúdo verdadeiro NUNCA entra no
// DOM antes do pagamento (inspecionar elemento não revela nada).
const FAKE_LINES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
]

export function LockedSection({ onUnlock }: { onUnlock: () => void }) {
  return (
    <section className="relative mt-8 overflow-hidden rounded-2xl border border-gold/40 bg-night-card shadow-xl shadow-black/40">
      <div className="p-5">
        <h3 className="font-headline text-xl font-bold text-gold">{lockedSection.title}</h3>
        <ul className="mt-4 space-y-3">
          {lockedSection.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-snug text-cream">
              <span className="text-gold">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Conteúdo fake borrado + cadeado dourado que balança */}
      <div className="relative select-none px-5 pb-5" aria-hidden="true">
        <div className="space-y-2 blur-[7px]">
          {FAKE_LINES.map((l, i) => (
            <p key={i} className="text-sm text-fog">{l}</p>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-night-card/40 to-night-card/90">
          <span className="lock-swing text-5xl drop-shadow-[0_0_14px_rgba(240,199,94,0.6)]">🔒</span>
        </div>
      </div>

      <div className="px-5 pb-6">
        <button onClick={onUnlock} className="cta">
          {lockedSection.cta}
        </button>
        <p className="mt-3 text-center text-xs text-fog">{lockedSection.microcopy}</p>
      </div>
    </section>
  )
}
