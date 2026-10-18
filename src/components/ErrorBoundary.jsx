import { Component } from 'react'

// Страховка: если какой-то блок упадёт, показываем аккуратную заглушку вместо белого экрана
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="page-head page-head--center">
        <div className="container">
          <p className="eyebrow">Что-то пошло не так</p>
          <h1 className="h1">Мы уже <em>разбираемся</em></h1>
          <p className="lead">Попробуйте обновить страницу или вернуться на главную.</p>
          <a href="#/" className="btn btn--metal">На главную</a>
        </div>
      </section>
    )
  }
}
