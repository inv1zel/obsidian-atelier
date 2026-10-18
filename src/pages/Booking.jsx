import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SlotPicker from '../components/SlotPicker'
import ClassCar from '../components/ClassCar'
import Ticket from '../components/Ticket'
import {
  carClasses, directions, servicesByDir, serviceById,
  priceFor, formatPrice, formatDuration, totalDuration,
} from '../data/services'
import { addBooking, formatDate, slotState } from '../lib/bookings'
import { downloadIcs } from '../lib/ics'

const STEPS = ['Автомобиль', 'Услуги', 'Дата и время', 'Проверка']
const HINTS = ['Выберите класс автомобиля', 'Отметьте хотя бы одну услугу', 'Выберите день и время']

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
  const [slotLost, setSlotLost] = useState(false)

  const chosen = useMemo(() => picked.map(serviceById), [picked])
  const total = chosen.reduce((s, x) => s + priceFor(x, cls ?? 'sedan'), 0)
  const duration = chosen.length ? totalDuration(chosen) : null

  const canNext = [!!cls, picked.length > 0, !!(slot.date && slot.time), true][step]
  const nextLabel = step === 2 ? 'К проверке' : 'Далее'
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const go = (n) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirm = () => {
    if (slotState(slot.date, slot.time) !== 'free') {
      setSlot({ date: null, time: null })
      setSlotLost(true)
      go(2)
      return
    }
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
                  {carClasses.map((c, i) => (
                    <button key={c.id} role="radio" aria-checked={cls === c.id} className="class-card" onClick={() => setCls(c.id)}>
                      <span className="class-card__top">
                        <span className="class-card__num">0{i + 1}</span>
                        <span className="class-card__check" aria-hidden="true" />
                      </span>
                      <ClassCar type={c.id} />
                      <span className="class-card__name">{c.name}</span>
                      <span className="class-card__hint">{c.hint}</span>
                      <span className="class-card__from">
                        Полировка <b>от {formatPrice(priceFor(serviceById('polish'), c.id))}</b>
                      </span>
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
                {slotLost && (
                  <p className="notice" role="alert">Выбранное время уже недоступно — пожалуйста, выберите другое.</p>
                )}
                <SlotPicker date={slot.date} time={slot.time} onChange={(v) => { setSlot(v); setSlotLost(false) }} />
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
              <strong>{chosen.length ? formatPrice(total) : '—'}</strong>
            </div>
            {duration && <p className="muted small">Срок работ: {formatDuration(duration)}</p>}
            <div className="summary__actions">
              {step > 0 && (
                <button className="btn btn--ghost" onClick={() => go(step - 1)}>Назад</button>
              )}
              {step < 3 ? (
                <button className="btn btn--metal" disabled={!canNext} onClick={() => go(step + 1)}>{nextLabel}</button>
              ) : (
                <button className="btn btn--metal" onClick={confirm}>Подтвердить запись</button>
              )}
            </div>
            {!canNext && step < 3 && <p className="summary__hint">{HINTS[step]}</p>}
            <p className="muted small summary__note">Окончательная цена фиксируется после осмотра и не меняется в процессе работы.</p>
          </aside>
        </div>
      </div>

      {/* мобильная панель итога */}
      <div className="mbar" role="region" aria-label="Итог и навигация">
        {step > 0 && (
          <button className="mbar__back" onClick={() => go(step - 1)} aria-label="Назад">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        )}
        <div className="mbar__sum">
          <strong>{chosen.length ? formatPrice(total) : '—'}</strong>
          <span>{chosen.length ? `${chosen.length} усл. · ${formatDuration(duration)}` : 'Ничего не выбрано'}</span>
        </div>
        {step < 3 ? (
          <button className="btn btn--metal mbar__next" disabled={!canNext} onClick={() => go(step + 1)}>{nextLabel}</button>
        ) : (
          <button className="btn btn--metal mbar__next" onClick={confirm}>Подтвердить</button>
        )}
      </div>
    </section>
  )
}


function Done({ booking: b }) {
  return (
    <section className="booking booking--done">
      <div className="container done">
        <div className="done__mark" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path className="done__diamond" pathLength="1" d="M24 4 42 24 24 44 6 24Z" fill="none" stroke="currentColor" />
            <path className="done__tick" pathLength="1" d="M16 24l6 6 10-12" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
        <p className="eyebrow done__eyebrow">Запись подтверждена</p>
        <h1 className="h1 done__title">Ждём вас</h1>
        <Ticket booking={b} />
        <div className="done__actions">
          <Link to="/visits" className="btn btn--metal">Мои визиты</Link>
          <button className="btn btn--ghost" onClick={() => downloadIcs(b)}>Добавить в календарь</button>
        </div>
        <Link to="/" className="link-arrow small done__home">На главную</Link>
      </div>
    </section>
  )
}
