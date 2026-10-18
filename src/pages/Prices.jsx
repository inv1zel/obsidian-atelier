import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'
import { carClasses, directions, servicesByDir, priceFor, formatPrice, formatDuration } from '../data/services'

export default function Prices() {
  const [cls, setCls] = useState('sedan')
  const current = carClasses.find((c) => c.id === cls)

  return (
    <>
      <PageHead
        eyebrow="Цены"
        title={<>Честно и <em>заранее</em></>}
        lead="Указаны начальные цены по классу автомобиля. Точную стоимость фиксируем после диагностики — и она не меняется в процессе работы."
      >
        <div className="class-tabs" role="tablist" aria-label="Класс автомобиля">
          {carClasses.map((c) => (
            <button key={c.id} role="tab" aria-selected={cls === c.id} onClick={() => setCls(c.id)}>
              <span>{c.name}</span>
              <small>{c.hint}</small>
            </button>
          ))}
        </div>
      </PageHead>

      <section className="section section--tight">
        <div className="container price-tables">
          {directions.map((d) => (
            <Reveal key={d.id} className="price-table">
              <h2 className="price-table__h">
                <Link to={`/services/${d.id}`}>{d.name}</Link>
              </h2>
              <table>
                <caption className="sr-only">{d.name}, {current.name}</caption>
                <thead>
                  <tr>
                    <th scope="col">Услуга</th>
                    <th scope="col">Срок</th>
                    <th scope="col">Цена</th>
                    <th scope="col"><span className="sr-only">Запись</span></th>
                  </tr>
                </thead>
                <tbody>
                  {servicesByDir(d.id).map((s) => (
                    <tr key={s.id}>
                      <th scope="row">{s.name}</th>
                      <td className="muted">{formatDuration(s.duration)}</td>
                      <td className="price-table__price">
                        {s.price ? `от ${formatPrice(priceFor(s, cls))}` : formatPrice(0)}
                      </td>
                      <td>
                        <Link to={`/booking?service=${s.id}&class=${cls}`} className="price-table__book" aria-label={`Записаться: ${s.name}`}>
                          Записаться
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  )
}
