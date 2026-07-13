import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFunnel } from '../store'
import { track, trackPurchase, purchaseFromParams } from '../lib/tracking'
import { markLeadComprou } from '../lib/leads'

/**
 * Retorno do pagamento do Mapa (R$ 24,90 — preço único).
 * Verificação nesta versão: query param ?paid=1 + localStorage.
 * TODO (futuro): validar server-side via webhook do gateway antes de liberar.
 */
export function Obrigada() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const markPaidMapa = useFunnel((s) => s.markPaidMapa)
  const paidMapa = useFunnel((s) => s.paidMapa)
  const leadId = useFunnel((s) => s.leadId)

  useEffect(() => {
    if (params.get('paid') === '1' || paidMapa) {
      markPaidMapa()
      // Pagamento aprovado → Purchase (Pixel + CAPI, uma única vez por pedido).
      trackPurchase(purchaseFromParams('mapa', params))
      track('compra_1999') // evento custom do funil (sem Purchase duplicado)
      void markLeadComprou(leadId) // tira o lead da fila de recuperação da Leona
      const t = setTimeout(() => navigate('/manual', { replace: true }), 2000)
      return () => clearTimeout(t)
    }
    navigate('/desbloquear', { replace: true })
  }, [])

  return (
    <main className="app-col flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-mint text-4xl text-night shadow-[0_0_30px_rgba(78,205,196,0.5)]"
      >
        ✓
      </motion.span>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 text-xl font-bold">
        ✓ Pagamento confirmado. Criamos sua conta n’O Ninho com o e-mail da compra. Preparando seu Mapa...
      </motion.p>
    </main>
  )
}
