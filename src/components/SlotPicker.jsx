import { useMemo } from 'react'
import { TIMES, dayHasFree, slotState, toISO, fromISO } from '../lib/bookings'

const DAYS_AHEAD = 21

// Выбор дня и времени. ignoreCode — при переносе своя запись не считается занятой.
export default function SlotPicker({ date, time, onChange, ignoreCode }) {
  const days = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return toISO(d)
    })
  }, [])

  const activeDate = date ?? days.find((d) => dayHasFree(d, ignoreCode)) ?? days[0]
  const month = fromISO(activeDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <div className="slots">
      <p className="slots__month">{month}</p>
      <div className="days" role="radiogroup" aria-label="День визита">
        {days.map((iso) => {
          const d = fromISO(iso)
          const free = dayHasFree(iso, ignoreCode)
          return (
            <button
              key={iso}
              role="radio"
              aria-checked={iso === activeDate}
              disabled={!free}
              className="day"
              onClick={() => onChange({ date: iso, time: null })}
            >
              <span className="day__wd">{d.toLocaleDateString('ru-RU', { weekday: 'short' })}</span>
              <span className="day__n">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div className="times" role="radiogroup" aria-label="Время визита">
        {TIMES.map((t) => {
          const st = slotState(activeDate, t, ignoreCode)
          return (
            <button
              key={t}
              role="radio"
              aria-checked={date === activeDate && time === t}
              disabled={st !== 'free'}
              className={`time time--${st}`}
              onClick={() => onChange({ date: activeDate, time: t })}
              title={st === 'busy' ? 'Занято' : st === 'mine' ? 'У вас уже есть запись на это время' : undefined}
            >
              {t}
            </button>
          )
        })}
      </div>
      <p className="slots__legend muted small">
        <span className="dot dot--free" /> свободно <span className="dot dot--busy" /> занято
        <span className="dot dot--mine" /> ваша запись
      </p>
    </div>
  )
}
