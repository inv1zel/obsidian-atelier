import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useBookings } from '../lib/bookings'

const nav = [
  { to: '/services', label: 'Услуги' },
  { to: '/works', label: 'Работы' },
  { to: '/palette', label: 'Палитра' },
  { to: '/prices', label: 'Цены' },
  { to: '/atelier', label: 'Ателье' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const active = useBookings().filter((b) => b.status === 'active').length

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
  }, [open])

  return (
    <header className={`header ${scrolled || open ? 'header--solid' : ''} ${open ? 'header--open' : ''}`}>
      <div className="container header__row">
        <Link to="/" className="header__logo" aria-label="OBSIDIAN — на главную">
          <Logo />
        </Link>
        <nav className="header__nav" aria-label="Основная навигация">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="header__link">
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__actions">
          <NavLink to="/visits" className="header__visits">
            Мои визиты
            {active > 0 && <span className="badge">{active}</span>}
          </NavLink>
          <Link to="/booking" className="btn btn--metal btn--sm">
            Записаться
          </Link>
          <button
            className="burger"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="mobile-menu" hidden={!open}>
        <nav className="container">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="mobile-menu__link">
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/visits" className="mobile-menu__link">
            Мои визиты {active > 0 && <span className="badge">{active}</span>}
          </NavLink>
          <Link to="/booking" className="btn btn--metal mobile-menu__cta">
            Записаться
          </Link>
        </nav>
      </div>
    </header>
  )
}
