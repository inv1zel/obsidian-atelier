import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SlotPicker from '../components/SlotPicker'
import {
  carClasses, directions, servicesByDir, serviceById,
  priceFor, formatPrice, formatDuration, totalDuration,
} from '../data/services'
import { addBooking, formatDate } from '../lib/bookings'
import { downloadIcs } from '../lib/ics'

const STEPS = ['Автомобиль', 'Услуги', 'Дата и время', 'Проверка']

export default function Booking() {
  const [params] = useSearchParams()
  const preService = serviceById(params.get('service'))
  const preClass = carClasses.some((c) => c.id === params.get('class')) ? params.get('class') : null

  const [step, setStep] = useState(0)
  const [cls, setCls] = useState(preClass)
  const [car, setCar] = useState('')
  const [picked, setPicked] = useState(preService ? [preService.id] : [])
  const [slot, setSlot] = useState({ date: null, time: null })
  const [comment, setComment] = useState(params.get('note') ?? '')
  const [done, setDone] = useState(null)

  const chosen = useMemo(() => picked.map(serviceById), [picked])
  const total = chosen.reduce((s, x) => s + priceFor(x, cls ?? 'sedan'), 0)
  const duration = chosen.length ? totalDuration(chosen) : null

  const canNext = [!!cls, picked.length > 0, !!(slot.date && slot.time), true][step]
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const go = (n) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirm = () => {
    const b = addBooking({
      classId: cls,
      car: car.trim(),
      serviceIds: picked,
      date: slot.date,
      time: slot.time,
      total,
      duration,
      comment: comment.trim(),
    })
    setDone(b)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (done) return <Done booking={done} />

  return (
    <section className="booking">
      <div className="container">
        <header className="booking__head">
          <p className="eyebrow">Запись</p>
          <h1 className="h1">Визит в <em>ателье</em></h1>
          <p className="muted booking__privacy">
            Без телефона и почты: запись сохраняется только в вашем браузере и доступна в разделе «Мои визиты».
          </p>
        </header>

        <ol className="stepper" aria-label="Шаги записи">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
              <button disabled={i > step} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                <span className="stepper__n">{i < step ? '✓' : i + 1}</span>
                <span className="stepper__t">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="booking__grid">
          <div className="booking__main">
            {step === 0 && (
              <div className="b-step">
                <h2 className="h3">Класс автомобиля</h2>
                <div className="class-cards" role="radiogroup" aria-label="Класс автомобиля">
                  {carClasses.map((c) => (
                    <button key={c.id} role="radio" aria-checked={cls === c.id} className="class-card" onClick={() => setCls(c.id)}>
                      <CarIcon type={c.id} />
                      <span className="class-card__name">{c.name}</span>
                      <span className="muted small">{c.hint}</span>
                    </button>
                  ))}
                </div>
                <label className="field">
                  <span className="field__label">Марка и модель <span className="muted">— по желанию</span></span>
                  <input
                    className="input"
                    value={car}
                    maxLength={60}
                    onChange={(e) => setCar(e.target.value)}
                    placeholder="Например, Porsche 911 Carrera"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="b-step">
                <h2 className="h3">Что делаем</h2>
                <p className="muted small">Можно выбрать несколько услуг. Не уверены — отметьте диагностику, остальное подберём на месте.</p>
                {directions.map((d) => (
                  <fieldset key={d.id} className="svc-group">
                    <legend>{d.name}</legend>
                    {servicesByDir(d.id).map((s) => (
                      <label key={s.id} className={`svc-opt ${picked.includes(s.id) ? 'is-on' : ''}`}>
                        <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} />
                        <span className="svc-opt__box" aria-hidden="true" />
                        <span className="svc-opt__name">
                          {s.name}
                          <small className="muted">{formatDuration(s.duration)}</small>
                        </span>
                        <span className="svc-opt__price">{formatPrice(priceFor(s, cls))}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="b-step">
                <h2 className="h3">Когда удобно приехать</h2>
                <p className="muted small">
                  Это время приёма автомобиля. {duration?.d ? `Работы займут ${formatDuration(duration)} — машина останется в ателье.` : ''}
                </p>
                <SlotPicker date={slot.date} time={slot.time} onChange={setSlot} />
              </div>
            )}

            {step === 3 && (
              <div className="b-step">
                <h2 className="h3">Проверьте запись</h2>
                <dl className="review-list">
                  <div><dt>Автомобиль</dt><dd>{carClasses.find((c) => c.id === cls).name}{car && ` · ${car}`}</dd></div>
                  <div><dt>Дата</dt><dd>{formatDate(slot.date)}, {slot.time}</dd></div>
                  <div><dt>Услуги</dt><dd>{chosen.map((s) => s.name).join(', ')}</dd></div>
                  <div><dt>Срок работ</dt><dd>{formatDuration(duration)}</dd></div>
                </dl>
                <label className="field">
                  <span className="field__label">Пожелания <span className="muted">— по желанию</span></span>
                  <textarea
                    className="input"
                    rows={3}
                    maxLength={300}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: обратить внимание на скол на капоте"
                  />
                  <span className="muted small">Пожалуйста, не указывайте здесь контактные данные — они не нужны.</span>
                </label>
              </div>
            )}

            <div className="b-nav">
              {step > 0 ? (
                <button className="btn btn--ghost" onClick={() => go(step - 1)}>Назад</button>
              ) : <span />}
              {step < 3 ? (
                <button className="btn btn--gold" disabled={!canNext} onClick={() => go(step + 1)}>Далее</button>
              ) : (
                <button className="btn btn--gold" onClick={confirm}>Подтвердить запись</button>
              )}
            </div>
          </div>

          <aside className="summary" aria-label="Итог">
            <p className="eyebrow">Ваш визит</p>
            {chosen.length === 0 ? (
              <p className="muted small">Пока ничего не выбрано</p>
            ) : (
              <ul className="summary__list">
                {chosen.map((s) => (
                  <li key={s.id}>
                    <span>{s.name}</span>
                    <span>{formatPrice(priceFor(s, cls ?? 'sedan'))}</span>
                  </li>
                ))}
              </ul>
            )}
            {slot.date && slot.time && (
              <p className="summary__when">{formatDate(slot.date, { day: 'numeric', month: 'long' })}, {slot.time}</p>
            )}
            <div className="summary__total">
              <span>Итого{!cls && ' (седан)'}</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            {duration && <p className="muted small">Срок работ: {formatDuration(duration)}</p>}
            <p className="muted small summary__note">Окончательная цена фиксируется после осмотра и не меняется в процессе работы.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Done({ booking: b }) {
  return (
    <section className="booking booking--done">
      <div className="container done">
        <div className="done__mark" aria-hidden="true">
          <svg viewBox="0 0 48 48"><path d="M24 4 42 24 24 44 6 24Z" fill="none" stroke="currentColor" /><path d="M16 24l6 6 10-12" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </div>
        <p className="eyebrow">Запись подтверждена</p>
        <h1 className="h1">Ждём вас</h1>
        <p className="lead">{formatDate(b.date)}, {b.time}</p>
        <div className="done__code">
          <span className="muted small">Код брони</span>
          <strong>{b.code}</strong>
        </div>
        <p className="muted done__services">
          {b.serviceIds.map((id) => serviceById(id)?.name).join(' · ')}
        </p>
        <div className="done__actions">
          <Link to="/visits" className="btn btn--gold">Мои визиты</Link>
          <button className="btn btn--ghost" onClick={() => downloadIcs(b)}>Добавить в календарь</button>
        </div>
        <Link to="/" className="link-arrow small">На главную</Link>
      </div>
    </section>
  )
}

// простые силуэты для выбора класса
function CarIcon({ type }) {
  const paths = {
    sedan: 'M6 34 C6 30 9 28 14 27 L24 25 C28 19 34 16 42 16 L58 16 C64 16 68 20 72 25 L84 27 C88 28 90 31 90 34 L90 38 L6 38 Z',
    crossover: 'M6 34 C6 29 9 27 14 26 L22 24 C26 16 32 13 40 13 L64 13 C70 13 74 17 78 24 L85 26 C89 27 90 30 90 34 L90 39 L6 39 Z',
    suv: 'M6 36 L6 25 C6 22 8 20 12 20 L20 20 L24 10 L76 10 C79 10 81 12 82 15 L86 22 C89 23 90 25 90 28 L90 39 L6 39 Z',
    super: 'M4 34 C4 31 8 29 16 28 L34 24 C40 20 46 18 54 18 C62 18 70 22 80 27 L88 29 C91 30 92 32 92 34 L92 37 L4 37 Z',
  }
  return (
    <svg className="class-card__icon" viewBox="0 0 96 48" aria-hidden="true">
      <path d={paths[type]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="24" cy="39" r="6" fill="var(--bg-2)" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="72" cy="39" r="6" fill="var(--bg-2)" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
