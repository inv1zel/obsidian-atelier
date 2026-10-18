import { useEffect, useState } from 'react'
import { carClasses, serviceById, formatPrice, formatDuration } from '../data/services'
import { formatDate, fromISO } from '../lib/bookings'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// Код «подбирается» символ за символом, как на табло
function useScramble(text, start, step = 110) {
  const [out, setOut] = useState(() => text.replace(/[^-]/g, '·'))
  useEffect(() => {
    let frame
    const t0 = performance.now() + start
    const tick = (now) => {
      const t = now - t0
      if (t < 0) {
        frame = requestAnimationFrame(tick)
        return
      }
      const locked = Math.floor(t / step)
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === '-' || i < locked ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      )
      if (locked < text.length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, start, step])
  return out
}

// декоративный штрихкод из кода брони
const bars = (code) =>
  code
    .replace('-', '')
    .split('')
    .flatMap((c) => {
      const n = c.charCodeAt(0)
      return [1 + (n % 3), 1 + ((n >> 2) % 2), 1 + ((n >> 1) % 3), 1 + ((n >> 3) % 2)]
    })

export default function Ticket({ booking: b }) {
  const code = useScramble(b.code, 1250)
  const d = fromISO(b.date)
  const cls = carClasses.find((c) => c.id === b.classId)
  let x = 0

  return (
    <div className="ticket-wrap">
      <div className="ticket-slot" aria-hidden="true" />
      <div className="ticket-viewport">
        <article className="ticket" aria-label={`Талон на визит, код ${b.code}`}>
          <header className="ticket__head">
            <span className="ticket__brand">OBSIDIAN</span>
            <span className="ticket__kind">Талон на визит</span>
          </header>

          <div className="ticket__when">
            <div>
              <span className="ticket__day">{d.getDate()}</span>
              <span className="ticket__month">
                {d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }).split(' ')[1]}
                <small>{d.toLocaleDateString('ru-RU', { weekday: 'long' })}</small>
              </span>
            </div>
            <span className="ticket__time">{b.time}</span>
          </div>

          <dl className="ticket__rows">
            <div><dt>Автомобиль</dt><dd>{cls?.name}{b.car && ` · ${b.car}`}</dd></div>
            <div><dt>Услуги</dt><dd>{b.serviceIds.map((id) => serviceById(id)?.name).join(', ')}</dd></div>
            <div><dt>Срок работ</dt><dd>{formatDuration(b.duration)}</dd></div>
            <div><dt>Итого</dt><dd className="ticket__total">{formatPrice(b.total)}</dd></div>
          </dl>

          <div className="ticket__perf" aria-hidden="true" />

          <div className="ticket__foot">
            <div>
              <span className="ticket__label">Код брони</span>
              <strong className="ticket__code" aria-hidden="true">{code}</strong>
            </div>
            <svg className="ticket__bars" viewBox={`0 0 ${bars(b.code).reduce((s, w) => s + w + 1.4, 0)} 40`} preserveAspectRatio="none" aria-hidden="true">
              {bars(b.code).map((w, i) => {
                const r = <rect key={i} x={x} y="0" width={w} height="40" fill="currentColor" opacity={i % 4 === 1 ? 0.55 : 1} />
                x += w + 1.4
                return r
              })}
            </svg>
          </div>
          <span className="ticket__sheen" aria-hidden="true" />
        </article>
      </div>
      <p className="sr-only">{formatDate(b.date)}, {b.time}. Код брони {b.code}.</p>
    </div>
  )
}
