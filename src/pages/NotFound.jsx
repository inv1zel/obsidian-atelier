import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-head page-head--center">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1 className="h1">Здесь <em>пусто</em></h1>
        <p className="lead">Такой страницы нет — но машина, возможно, уже ждёт полировки.</p>
        <Link to="/" className="btn btn--metal">На главную</Link>
      </div>
    </section>
  )
}
