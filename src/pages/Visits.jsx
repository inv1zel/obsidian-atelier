import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import SlotPicker from '../components/SlotPicker'
import { useBookings, updateBooking, removeBooking, formatDate, fromISO } from '../lib/bookings'
import { carClasses, serviceById, formatPrice, formatDuration } from '../data/services'
import { downloadIcs } from '../lib/ics'

const isPast = (b) => {
  const d = fromISO(b.date)
  d.setHours(Number(b.time.split(':')[0]))
  return d < new Date()
}

export default function Visits() {
  const list = useBookings()
  const upcoming = list.filter((b) => b.status === 'active' && !isPast(b))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const archive = list.filter((b) => b.status !== 'active' || isPast(b))

  return (
    <>
      <PageHead
        eyebrow="Мои визиты"
        title={<>Ваши <em>записи</em></>}
        lead="Записи хранятся только в этом браузере. Здесь можно перенести визит или отменить его."
      />
      <section className="section section--tight">
        <div className="container visits">
          {list.length === 0 && (
            <div className="empty">
              <p className="h3">Пока нет ни одной записи</p>
              <p className="muted">Начните с бесплатной диагностики — это час времени и честный взгляд на состояние машины.</p>
              <div className="empty__actions">
                <Link to="/booking?service=diag" className="btn btn--gold">Записаться на диагностику</Link>
                <Link to="/booking" className="btn btn--ghost">Выбрать услуги</Link>
              </div>
            </div>
          )}

          {upcoming.length > 0 && (
            <>
              <h2 className="visits__h">Предстоящие</h2>
              {upcoming.map((b) => <Visit key={b.code} b={b} />)}
            </>
          )}
          {archive.length > 0 && (
            <>
              <h2 className="visits__h">Архив</h2>
              {archive.map((b) => <Visit key={b.code} b={b} archived />)}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function Visit({ b, archived }) {
  const [mode, setMode] = useState(null) // 'move' | 'cancel'
  const [slot, setSlot] = useState({ date: null, time: null })
  const cls = carClasses.find((c) => c.id === b.classId)
  const cancelled = b.status === 'cancelled'

  const saveMove = () => {
    updateBooking(b.code, { date: slot.date, time: slot.time })
    setMode(null)
  }

  return (
    <article className={`visit ${archived ? 'visit--archived' : ''}`}>
      <div className="visit__main">
        <div className="visit__date">
          <span className="visit__day">{fromISO(b.date).getDate()}</span>
          <span className="visit__month">{fromISO(b.date).toLocaleDateString('ru-RU', { month: 'short' })}</span>
          <span className="visit__time">{b.time}</span>
        </div>
        <div className="visit__info">
          <p className="visit__code">
            {b.code}
            {cancelled && <span className="chip chip--muted">Отменена</span>}
            {!cancelled && archived && <span className="chip chip--muted">Состоялась</span>}
          </p>
          <h3 className="visit__services">{b.serviceIds.map((id) => serviceById(id)?.name).join(' · ')}</h3>
          <p className="muted small">
            {formatDate(b.date)} · {cls?.name}{b.car && ` · ${b.car}`} · {formatDuration(b.duration)}
          </p>
          {b.comment && <p className="visit__comment muted small">«{b.comment}»</p>}
        </div>
        <div className="visit__total">{formatPrice(b.total)}</div>
      </div>

      <div className="visit__actions">
        {!archived && (
          <>
            <button className="btn btn--ghost btn--sm" aria-expanded={mode === 'move'} onClick={() => setMode(mode === 'move' ? null : 'move')}>
              Перенести
            </button>
            <button className="btn btn--ghost btn--sm" onClick={() => downloadIcs(b)}>В календарь</button>
            <button className="btn btn--text btn--sm" onClick={() => setMode('cancel')}>Отменить</button>
          </>
        )}
        {archived && (
          <button className="btn btn--text btn--sm" onClick={() => removeBooking(b.code)}>Удалить из списка</button>
        )}
      </div>

      {mode === 'cancel' && (
        <div className="visit__panel visit__panel--confirm" role="alert">
          <p>Отменить запись {b.code}?</p>
          <div>
            <button className="btn btn--ghost btn--sm" onClick={() => setMode(null)}>Нет, оставить</button>
            <button className="btn btn--danger btn--sm" onClick={() => updateBooking(b.code, { status: 'cancelled' })}>
              Да, отменить
            </button>
          </div>
        </div>
      )}

      {mode === 'move' && (
        <div className="visit__panel">
          <SlotPicker date={slot.date} time={slot.time} onChange={setSlot} ignoreCode={b.code} />
          <div className="visit__panel-foot">
            <button className="btn btn--ghost btn--sm" onClick={() => setMode(null)}>Отмена</button>
            <button className="btn btn--gold btn--sm" disabled={!slot.date || !slot.time} onClick={saveMove}>
              Перенести{slot.date && slot.time ? ` на ${formatDate(slot.date, { day: 'numeric', month: 'long' })}, ${slot.time}` : ''}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
