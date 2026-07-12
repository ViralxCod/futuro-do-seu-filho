import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Landing } from './pages/Landing'
import { Quiz } from './pages/Quiz'
import { Analisando } from './pages/Analisando'
import { Resultado } from './pages/Resultado'
import { Desbloquear } from './pages/Desbloquear'
import { Obrigada } from './pages/Obrigada'
import { Manual } from './pages/Manual'
import { Mapa } from './pages/Mapa'
import { Ninho } from './pages/Ninho'
import { NinhoAdmin } from './pages/NinhoAdmin'
import { useFunnel, isExpired } from './store'
import { initPixels } from './lib/tracking'

function ExpiryGuard() {
  // Se o prazo de 15 min estourou (e não pagou), o resultado é apagado
  // de verdade — a promessa da copy ("as respostas são apagadas") é real.
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const state = useFunnel.getState()
    if (isExpired(state)) {
      state.expire()
      if (location.pathname !== '/') navigate('/', { replace: true })
    }
  }, [location.pathname, navigate])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/analisando" element={<Analisando />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/desbloquear" element={<Desbloquear />} />
        <Route path="/obrigada" element={<Obrigada />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/ninho" element={<Ninho />} />
        <Route path="/ninho/admin" element={<NinhoAdmin />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    initPixels()
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ExpiryGuard />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
