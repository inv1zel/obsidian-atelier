import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function CtaBand({ title = 'Начнём с диагностики', text = 'Бесплатный осмотр в свете и замер лака. Час времени — и вы точно знаете, что нужно вашей машине.' }) {
  return (
    <section className="section">
      <Reveal className="container cta-band">
        <div>
          <h2 className="h2">{title}</h2>
          <p className="muted cta-band__text">{text}</p>
        </div>
        <div className="cta-band__actions">
          <Link to="/booking?service=diag" className="btn btn--gold">Записаться на диагностику</Link>
          <Link to="/booking" className="btn btn--ghost">Выбрать услуги</Link>
        </div>
      </Reveal>
    </section>
  )
}
