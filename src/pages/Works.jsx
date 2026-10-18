import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import BeforeAfter from '../components/BeforeAfter'
import CtaBand from '../components/CtaBand'
import { works } from '../data/works'
import { directions, directionById } from '../data/services'

export default function Works() {
  const [filter, setFilter] = useState('all')
  const used = directions.filter((d) => works.some((w) => w.dir === d.id))
  const list = filter === 'all' ? works : works.filter((w) => w.dir === filter)

  return (
    <>
      <PageHead
        eyebrow="Работы"
        title={<>До и <em>после</em></>}
        lead="Потяните разделитель на фотографии, чтобы сравнить состояние автомобиля до и после работы."
      >
        <div className="chips" role="tablist" aria-label="Фильтр по направлению">
          <button role="tab" aria-selected={filter === 'all'} className="chip-btn" onClick={() => setFilter('all')}>
            Все
          </button>
          {used.map((d) => (
            <button key={d.id} role="tab" aria-selected={filter === d.id} className="chip-btn" onClick={() => setFilter(d.id)}>
              {d.name}
            </button>
          ))}
        </div>
      </PageHead>

      <section className="section section--tight">
        <div className="container works">
          {list.map((w) => (
            <Reveal key={w.id} className="work">
              <BeforeAfter image={w.image} label={w.car} />
              <div className="work__info">
                <p className="eyebrow">{directionById(w.dir).name} · {w.days} дн.</p>
                <h2 className="h3">{w.car}</h2>
                <p className="work__title">{w.title}</p>
                <p className="muted">{w.text}</p>
                <Link to={`/services/${w.dir}`} className="link-arrow small">Об услуге →</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand title="Хотите так же?" />
    </>
  )
}
