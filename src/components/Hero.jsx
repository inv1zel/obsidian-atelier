import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroScene from './HeroScene'
import Arrow from './Arrow'

const slides = [
  {
    eyebrow: 'Автоателье премиум-класса',
    title: ['Сохраняем', 'идеальный вид'],
    text: ['Полировка. Защитные покрытия. Детейлинг.', 'Профессиональный уход за вашим автомобилем.'],
    cta: { to: '/services', label: 'Выбрать услугу' },
  },
  {
    eyebrow: 'Защитная плёнка · гарантия 10 лет',
    title: ['Защита,', 'которой не видно'],
    text: ['Полиуретан 200 мкм с самовосстановлением.', 'Сколы и царапины остаются на плёнке, а не на лаке.'],
    cta: { to: '/services/films', label: 'О защите кузова' },
  },
  {
    eyebrow: 'Оклейка в цвет · 60+ оттенков',
    title: ['Новый цвет', 'без покраски'],
    text: ['Глянец, сатин или мат — полностью обратимо.', 'Примерьте оттенок прямо на сайте.'],
    cta: { to: '/palette', label: 'Открыть палитру' },
  },
  {
    eyebrow: 'Диагностика · бесплатно',
    title: ['Свет, в котором', 'видно всё'],
    text: ['Замер лака по 40+ точкам и осмотр в трёх типах света.', 'Честный план работ — до начала работ.'],
    cta: { to: '/booking?service=diag', label: 'Записаться на осмотр' },
  },
]

const DURATION = 7000

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI((v) => (v + 1) % slides.length), DURATION)
    return () => clearTimeout(t)
  }, [i, paused])

  const s = slides[i]
  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="карусель"
    >
      <HeroScene />
      <div className="hero__veil" />

      <div className="container hero__content">
        <div key={i} className="hero__slide" aria-live="polite">
          <p className="hero__eyebrow">{s.eyebrow}</p>
          <h1 className="hero__title">
            {s.title.map((line) => (
              <span key={line} className="hero__line"><span>{line}</span></span>
            ))}
          </h1>
          <p className="hero__lead">
            {s.text[0]}<br />{s.text[1]}
          </p>
          <Link to={s.cta.to} className="btn btn--frame">
            {s.cta.label} <Arrow />
          </Link>
        </div>
      </div>

      <div className="hero__pager" role="tablist" aria-label="Слайды">
        <span className="hero__count">{String(i + 1).padStart(2, '0')}</span>
        <span className="hero__count hero__count--total">{String(slides.length).padStart(2, '0')}</span>
        <div className="hero__ticks">
          {slides.map((sl, n) => (
            <button
              key={n}
              role="tab"
              aria-selected={n === i}
              aria-label={`Слайд ${n + 1}: ${sl.title.join(' ')}`}
              className="hero__tick"
              onClick={() => setI(n)}
            >
              {n === i && <span className="hero__tick-fill" style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }} />}
            </button>
          ))}
        </div>
      </div>

      <div className="container hero__foot">
        <p className="hero__caption">Премиальный уход<br />для вашего автомобиля</p>
        <p className="hero__caption hero__caption--line">Совершенство в деталях</p>
      </div>
    </section>
  )
}
