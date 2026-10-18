import { Link, useParams } from 'react-router-dom'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import Arrow from '../components/Arrow'
import CtaBand from '../components/CtaBand'
import BeforeAfter from '../components/BeforeAfter'
import NotFound from './NotFound'
import { directions, directionById, servicesByDir, formatPrice, formatDuration } from '../data/services'
import { works } from '../data/works'

export default function Direction() {
  const { id } = useParams()
  const dir = directionById(id)
  if (!dir) return <NotFound />
  const list = servicesByDir(id)
  const work = works.find((w) => w.dir === id)
  const idx = directions.indexOf(dir)
  const next = directions[(idx + 1) % directions.length]

  return (
    <>
      <section className="dir-hero">
        <Photo k={dir.image} className="dir-hero__photo" eager />
        <div className="hero__veil" />
        <div className="container dir-hero__content">
          <Reveal>
            <Link to="/services" className="crumb">← Все услуги</Link>
            <p className="eyebrow">0{idx + 1} · {dir.tagline}</p>
            <h1 className="h1">{dir.name}</h1>
            <p className="lead">{dir.lead}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container svc-cards">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 80} className="svc-card">
              <div className="svc-card__top">
                <h2 className="h3">
                  {s.name}
                  {s.popular && <span className="chip">Часто выбирают</span>}
                </h2>
                <p className="muted">{s.text}</p>
              </div>
              <ul className="ticks">
                {s.includes.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <div className="svc-card__foot">
                <div>
                  <p className="svc-card__price">{s.price ? `от ${formatPrice(s.price)}` : formatPrice(0)}</p>
                  <p className="muted small">Срок: {formatDuration(s.duration)}</p>
                </div>
                <Link to={`/booking?service=${s.id}`} className="btn btn--ghost btn--sm">Записаться</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {work && (
        <section className="section section--alt">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Из наших работ</p>
              <h2 className="h2">{work.car}</h2>
            </Reveal>
            <Reveal className="feature-work">
              <BeforeAfter image={work.image} label={work.car} />
              <div className="feature-work__info">
                <h3 className="h3">{work.title}</h3>
                <p className="muted">{work.text}</p>
                <Link to="/works" className="link-arrow">Все работы <Arrow /></Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container">
          <Link to={`/services/${next.id}`} className="next-dir">
            <span className="eyebrow">Следующее направление</span>
            <span className="next-dir__name">{next.name} <Arrow /></span>
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
