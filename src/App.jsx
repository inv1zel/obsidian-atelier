import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Intro, { INTRO_KEY } from './components/Intro'
import Home from './pages/Home'
import Services from './pages/Services'
import Direction from './pages/Direction'
import Works from './pages/Works'
import Palette from './pages/Palette'
import Prices from './pages/Prices'
import Atelier from './pages/Atelier'
import Booking from './pages/Booking'
import Visits from './pages/Visits'
import NotFound from './pages/NotFound'

const TITLES = {
  '/': '',
  '/services': 'Услуги',
  '/works': 'Работы',
  '/palette': 'Палитра плёнок',
  '/prices': 'Цены',
  '/atelier': 'Ателье',
  '/booking': 'Запись',
  '/visits': 'Мои визиты',
}

const seenIntro = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [intro, setIntro] = useState(() => !seenIntro())
  const { pathname, key } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const t = TITLES[pathname] ?? (pathname.startsWith('/services/') ? 'Услуги' : 'Страница не найдена')
    document.title = t ? `${t} — OBSIDIAN` : 'OBSIDIAN — ателье детейлинга'
  }, [pathname])

  return (
    <>
      {intro && <Intro onDone={() => setIntro(false)} />}
      <div className={`app ${intro ? 'app--behind' : ''}`} aria-hidden={intro || undefined}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<Direction />} />
            <Route path="/works" element={<Works />} />
            <Route path="/palette" element={<Palette />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route path="/booking" element={<Booking key={key} />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}
