import { describe, it, expect } from 'vitest'
import { purchaseFromParams } from './tracking'

const q = (s: string) => new URLSearchParams(s)

describe('purchaseFromParams — valores e retorno do gateway', () => {
  it('usa o valor de fallback certo por produto quando o gateway não envia valor', () => {
    expect(purchaseFromParams('mapa', q('')).value).toBe(8.75)
    expect(purchaseFromParams('manual', q('')).value).toBe(27.99)
    expect(purchaseFromParams('completo', q('')).value).toBe(67.55)
  })

  it('respeita o valor real enviado pelo gateway (aceita vírgula ou ponto)', () => {
    expect(purchaseFromParams('completo', q('valor=67,55')).value).toBe(67.55)
    expect(purchaseFromParams('completo', q('value=67.55')).value).toBe(67.55)
    expect(purchaseFromParams('manual', q('amount=27.99')).value).toBe(27.99)
  })

  it('captura orderId e email quando presentes (para dedup e match da CAPI)', () => {
    const p = purchaseFromParams('completo', q('order=ABC123&email=mae@teste.com'))
    expect(p.orderId).toBe('ABC123')
    expect(p.email).toBe('mae@teste.com')
    expect(p.product).toBe('completo')
  })

  it('cai no fallback se o valor vier inválido ou zero', () => {
    expect(purchaseFromParams('completo', q('value=0')).value).toBe(67.55)
    expect(purchaseFromParams('completo', q('value=abc')).value).toBe(67.55)
  })
})
