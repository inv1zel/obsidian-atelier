import { useCallback, useEffect, useRef, useState } from 'react'
import { playEngineStart } from '../lib/engineSound'

// Интро «Фары в темноте».
// idle → (клик) → drl: зажигаются ходовые огни → lights: фары
// → flood: свет заливает экран, проявляется логотип → out: растворение
const TIMELINE = { drl: 250, lights: 1250, flood: 1900, out: 3100, done: 4000 }

export const INTRO_KEY = 'obsidian.intro.seen'

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState('idle')
  const timers = useRef([])
  const stopSound = useRef(null)
  const startBtn = useRef(null)

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout)
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {}
    onDone()
  }, [onDone])

  const skip = useCallback(() => {
    stopSound.current?.()
    timers.current.forEach(clearTimeout)
    setPhase('out')
    timers.current = [setTimeout(finish, 700)]
  }, [finish])

  const start = (withSound) => {
    if (phase !== 'idle') return
    if (withSound) stopSound.current = playEngineStart()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const k = reduce ? 0.45 : 1
    setPhase('ignite')
    timers.current = Object.entries(TIMELINE).map(([p, t]) =>
      setTimeout(() => (p === 'done' ? finish() : setPhase(p)), t * k),
    )
  }

  useEffect(() => {
    document.body.classList.add('no-scroll')
    startBtn.current?.focus()
    const onKey = (e) => e.key === 'Escape' && skip()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
      timers.current.forEach(clearTimeout)
    }
  }, [skip])

  return (
    <div className="intro" data-phase={phase} role="dialog" aria-label="Вступление">
      <div className="intro__beams" aria-hidden="true">
        <span className="intro__beam intro__beam--l" />
        <span className="intro__beam intro__beam--r" />
      </div>

      <svg className="intro__face" viewBox="0 0 800 220" aria-hidden="true">
        <defs>
          <filter id="drl-glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".35" stopColor="#fff6e6" />
            <stop offset="1" stopColor="#fff6e6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* едва заметный контур «лица» автомобиля */}
        <g className="intro__contour" fill="none" strokeWidth="1">
          <path d="M40 150 C 180 118, 620 118, 760 150" />
          <path d="M120 190 C 260 172, 540 172, 680 190" />
          <path d="M330 168 L 470 168" />
        </g>

        {/* ходовые огни: неосвещённые и горящие */}
        {[false, true].map((lit) => (
          <g
            key={String(lit)}
            className={lit ? 'intro__drl intro__drl--lit' : 'intro__drl'}
            filter={lit ? 'url(#drl-glow)' : undefined}
            fill="none"
            strokeLinecap="round"
          >
            <path pathLength="1" d="M88 76 C 150 64, 232 62, 302 80 L 322 104" />
            <path pathLength="1" d="M712 76 C 650 64, 568 62, 498 80 L 478 104" />
          </g>
        ))}

        {/* линзы фар */}
        <g className="intro__lamps">
          <circle cx="206" cy="104" r="22" className="intro__ring" />
          <circle cx="594" cy="104" r="22" className="intro__ring" />
          <circle cx="206" cy="104" r="34" fill="url(#lamp)" className="intro__bulb" />
          <circle cx="594" cy="104" r="34" fill="url(#lamp)" className="intro__bulb" />
        </g>
      </svg>

      <div className="intro__brand">
        <p className="intro__word">OBSIDIAN</p>
        <p className="intro__sub">ателье детейлинга</p>
      </div>

      <div className="intro__start">
        <button ref={startBtn} className="start-btn" onClick={() => start(true)}>
          <span className="start-btn__ring" aria-hidden="true" />
          <span className="start-btn__label">Войти</span>
          <span className="start-btn__hint" aria-hidden="true">engine start</span>
        </button>
        <button className="intro__mute" onClick={() => start(false)}>
          Войти без звука
        </button>
      </div>

      <div className="intro__flash" aria-hidden="true" />

      {phase !== 'idle' && phase !== 'out' && (
        <button className="intro__skip" onClick={skip}>
          Пропустить
        </button>
      )}
    </div>
  )
}
