import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import CarSide from '../components/CarSide'
import CtaBand from '../components/CtaBand'
import Arrow from '../components/Arrow'
import { directions } from '../data/services'
import { works } from '../data/works'
import { films } from '../data/films'

const stats = [
  { n: '12', u: 'лет', t: 'работаем с премиальными автомобилями' },
  { n: '1 900+', u: '', t: 'машин прошли через ателье' },
  { n: '10', u: 'лет', t: 'гарантия на защитную плёнку' },
  { n: '3', u: 'вида света', t: 'контроль качества перед выдачей' },
]

const steps = [
  { t: 'Диагностика', d: 'Осматриваем машину в свете, замеряем лак и показываем всё, что видим. Бесплатно.' },
  { t: 'План и смета', d: 'Предлагаем только то, что нужно. Фиксированная цена и срок — до начала работ.' },
  { t: 'Работа', d: 'Один мастер ведёт машину от начала до конца. Фотоотчёт по каждому этапу.' },
  { t: 'Выдача в свете', d: 'Принимаете работу вместе с мастером под студийными лампами. Без спешки.' },
]

const reviews = [
  { q: 'Отдал машину на полировку, а получил её как будто из салона. Впервые увидел, что лак может быть настолько глубоким.', a: 'Артём', car: 'Mercedes-AMG GT' },
  { q: 'Понравилось, что на диагностике честно сказали: полная плёнка не нужна, хватит фронтальной части. Это подкупает.', a: 'Мария', car: 'Porsche Macan' },
  { q: 'Звёздное небо и подсветка сделаны так, будто это было с завода. Ни одного лишнего провода.', a: 'Константин', car: 'BMW X7' },
]

export default function Home() {
  const [film, setFilm] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setFilm((i) => (i + 1) % films.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <section className="hero">
        <Photo k="hero" className="hero__photo" eager />
        <div className="hero__veil" />
        <div className="container hero__content">
          <p className="eyebrow hero__eyebrow">Ателье детейлинга · с 2014 года</p>
          <h1 className="hero__title">
            Защита.<br />Цвет.<br /><em>Свет.</em>
          </h1>
          <p className="lead hero__lead">
            Полировка, керамика, плёнки, салон и опции для автомобилей, которые заслуживают
            внимания к каждой детали.
          </p>
          <div className="hero__actions">
            <Link to="/booking" className="btn btn--metal">Записаться</Link>
            <Link to="/booking?service=diag" className="btn btn--ghost">Бесплатная диагностика</Link>
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true"><span /></div>
      </section>

      <section className="stats">
        <div className="container stats__grid">
          {stats.map((s, i) => (
            <Reveal key={s.t} delay={i * 80} className="stat">
              <p className="stat__n">{s.n}{s.u && <small> {s.u}</small>}</p>
              <p className="stat__t">{s.t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Направления</p>
            <h2 className="h2">Всё, что делает машину <em>безупречной</em></h2>
          </Reveal>
          <div className="dir-grid">
            {directions.map((d, i) => (
              <Reveal key={d.id} delay={i * 70} className={`dir-card dir-card--${i}`}>
                <Link to={`/services/${d.id}`} className="dir-card__link">
                  <Photo k={d.image} className="dir-card__photo" />
                  <div className="dir-card__body">
                    <span className="dir-card__num">0{i + 1}</span>
                    <h3 className="dir-card__name">{d.name}</h3>
                    <p className="dir-card__tag">{d.tagline}</p>
                    <span className="dir-card__more">Подробнее <Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split">
          <Reveal className="split__text">
            <p className="eyebrow">Подход</p>
            <h2 className="h2">Мы не продаём услуги. <em>Мы смотрим на машину.</em></h2>
            <p className="muted">
              Каждый визит начинается с диагностики. Мы замеряем лак, осматриваем кузов под тремя
              типами света и показываем вам всё, что видим. Если работа не нужна — так и скажем.
            </p>
            <p className="muted">
              В ателье одновременно находится не больше четырёх автомобилей. Это позволяет не
              торопиться и вести каждую машину одним мастером от начала до конца.
            </p>
            <Link to="/atelier" className="link-arrow">Об ателье <Arrow /></Link>
          </Reveal>
          <Reveal delay={120} className="steps">
            {steps.map((s, i) => (
              <div key={s.t} className="step">
                <span className="step__n">0{i + 1}</span>
                <div>
                  <h3 className="step__t">{s.t}</h3>
                  <p className="muted">{s.d}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--row">
            <div>
              <p className="eyebrow">Работы</p>
              <h2 className="h2">Потяните — <em>и сравните</em></h2>
            </div>
            <Link to="/works" className="link-arrow">Все работы <Arrow /></Link>
          </Reveal>
          <Reveal className="feature-work">
            <BeforeAfter image={works[1].image} label={works[1].car} />
            <div className="feature-work__info">
              <p className="eyebrow">{works[1].car}</p>
              <h3 className="h3">{works[1].title}</h3>
              <p className="muted">{works[1].text}</p>
              <p className="feature-work__days">{works[1].days} дня в ателье</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt palette-teaser">
        <div className="container split split--center">
          <Reveal className="split__text">
            <p className="eyebrow">Палитра плёнок</p>
            <h2 className="h2">Новый цвет — <em>без покраски</em></h2>
            <p className="muted">
              Более 60 оттенков в глянце, сатине и мате. Примерьте цвет на силуэте, а вживую
              покажем образцы на вашей машине.
            </p>
            <p className="palette-teaser__name">{films[film].name}</p>
            <Link to="/palette" className="btn btn--ghost">Открыть палитру</Link>
          </Reveal>
          <Reveal delay={120}>
            <CarSide color={films[film].hex} finish="gloss" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Отзывы</p>
            <h2 className="h2">Что говорят владельцы</h2>
          </Reveal>
          <div className="reviews">
            {reviews.map((r, i) => (
              <Reveal key={r.a} delay={i * 90} as="figure" className="review">
                <blockquote>«{r.q}»</blockquote>
                <figcaption>
                  <span>{r.a}</span>
                  <span className="muted">{r.car}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

