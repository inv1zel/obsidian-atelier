import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import Arrow from '../components/Arrow'
import CtaBand from '../components/CtaBand'
import { directions, servicesByDir, formatPrice } from '../data/services'

export default function Services() {
  return (
    <>
      <PageHead
        eyebrow="Услуги"
        title={<>Пять направлений — <em>один стандарт</em></>}
        lead="Выберите направление, чтобы увидеть состав работ, сроки и стоимость. Если сомневаетесь — начните с бесплатной диагностики."
      />
      <section className="section section--tight">
        <div className="container svc-list">
          {directions.map((d, i) => (
            <Reveal key={d.id} className="svc-row">
              <Link to={`/services/${d.id}`} className="svc-row__media">
                <Photo k={d.image} />
              </Link>
              <div className="svc-row__body">
                <span className="dir-card__num">0{i + 1}</span>
                <h2 className="h2">{d.name}</h2>
                <p className="muted">{d.lead}</p>
                <ul className="svc-row__items">
                  {servicesByDir(d.id).map((s) => (
                    <li key={s.id}>
                      <span>{s.name}</span>
                      <span className="svc-row__price">
                        {s.price ? `от ${formatPrice(s.price)}` : formatPrice(0)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to={`/services/${d.id}`} className="link-arrow">Подробнее <Arrow /></Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}
