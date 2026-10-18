import { Link } from 'react-router-dom'
import Logo from './Logo'
import { directions } from '../data/services'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="muted">Защита. Цвет. Свет.<br />Ателье детейлинга с 2014 года.</p>
        </div>
        <div>
          <h4 className="footer__h">Услуги</h4>
          {directions.map((d) => (
            <Link key={d.id} to={`/services/${d.id}`} className="footer__link">{d.name}</Link>
          ))}
        </div>
        <div>
          <h4 className="footer__h">Ателье</h4>
          <Link to="/works" className="footer__link">Работы</Link>
          <Link to="/palette" className="footer__link">Палитра плёнок</Link>
          <Link to="/prices" className="footer__link">Цены</Link>
          <Link to="/atelier" className="footer__link">О нас</Link>
        </div>
        <div>
          <h4 className="footer__h">Визит</h4>
          <Link to="/booking" className="footer__link">Записаться</Link>
          <Link to="/visits" className="footer__link">Мои визиты</Link>
          <p className="muted footer__hours">Ежедневно, 10:00 — 20:00</p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} OBSIDIAN</span>
        <span className="footer__note">
          Вымышленное ателье — концепт для портфолио. Сайт не собирает персональные данные.
        </span>
      </div>
    </footer>
  )
}
