import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import CarSide from '../components/CarSide'
import Reveal from '../components/Reveal'
import { films, finishes } from '../data/films'

export default function Palette() {
  const [film, setFilm] = useState(films[0])
  const [finish, setFinish] = useState('gloss')
  const fin = finishes.find((f) => f.id === finish)

  return (
    <>
      <PageHead
        eyebrow="Палитра плёнок"
        title={<>Примерьте <em>цвет</em></>}
        lead="Выберите оттенок и фактуру. Это ориентир — вживую мы покажем образцы на вашей машине при дневном и студийном свете."
      />
      <section className="section section--tight">
        <div className="container palette">
          <div className="palette__stage">
            <div className={`palette__studio palette__studio--${finish}`}>
              <CarSide key={finish} color={film.hex} finish={finish} className="car-side--sweep" />
            </div>
            <div className="palette__caption" aria-live="polite">
              <span className="palette__name">{film.name}</span>
              <span className="muted">{fin.name} · {fin.note}</span>
            </div>
          </div>

          <Reveal className="palette__panel">
            <h2 className="panel-label">Фактура</h2>
            <div className="segmented" role="radiogroup" aria-label="Фактура">
              {finishes.map((f) => (
                <button key={f.id} role="radio" aria-checked={finish === f.id} onClick={() => setFinish(f.id)}>
                  {f.name}
                </button>
              ))}
            </div>

            <h2 className="panel-label">Цвет</h2>
            <div className="swatches" role="radiogroup" aria-label="Цвет">
              {films.map((f) => (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={film.id === f.id}
                  aria-label={f.name}
                  title={f.name}
                  className={`swatch swatch--${finish}`}
                  style={{ '--c': f.hex }}
                  onClick={() => setFilm(f)}
                />
              ))}
            </div>

            <div className="palette__cta">
              <p className="muted small">
                Оклейка в цвет — от 240 000 ₽, 5 дней. Плёнка полностью обратима и защищает заводской лак.
              </p>
              <Link
                to={`/booking?service=color&note=${encodeURIComponent(`${film.name}, ${fin.name.toLowerCase()}`)}`}
                className="btn btn--gold"
              >
                Записаться на оклейку
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
