// Som suave opcional (Web Audio) — MUDO por padrão, ligado pelo botão 🔊.

const KEY = 'funil-sound-on'
let ctx: AudioContext | null = null

export function soundEnabled(): boolean {
  return localStorage.getItem(KEY) === '1'
}

export function toggleSound(): boolean {
  const on = !soundEnabled()
  localStorage.setItem(KEY, on ? '1' : '0')
  return on
}

function ensureCtx(): AudioContext | null {
  if (!soundEnabled()) return null
  try {
    ctx = ctx ?? new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function note(freq: number, start: number, dur: number, vol: number, c: AudioContext) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, c.currentTime + start)
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + dur + 0.05)
}

/** "tick" suave na resposta */
export function playTick() {
  const c = ensureCtx()
  if (c) note(880, 0, 0.09, 0.08, c)
}

/** "chime" no fim de bloco */
export function playChime() {
  const c = ensureCtx()
  if (!c) return
  note(660, 0, 0.25, 0.09, c)
  note(880, 0.12, 0.3, 0.09, c)
  note(1320, 0.24, 0.4, 0.07, c)
}

/** Vibração curta no toque (mobile) */
export function haptic() {
  try {
    navigator.vibrate?.(15)
  } catch {
    /* sem suporte */
  }
}
