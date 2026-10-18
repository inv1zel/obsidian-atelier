import { useState } from 'react'
import PageHead from '../components/PageHead'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'

const values = [
  { t: 'Не больше четырёх машин', d: 'Ателье намеренно небольшое. Мы не берём больше, чем можем сделать безупречно.' },
  { t: 'Один мастер — одна машина', d: 'Тот, кто начал работу, её и заканчивает. Никаких передач «по сменам».' },
  { t: 'Свет как инструмент', d: 'Три типа освещения в каждом боксе: дневной, тёплый и точечный. Дефекту негде спрятаться.' },
  { t: 'Фотоотчёт', d: 'Снимаем каждый этап работ — вы видите, что происходит с машиной, даже не приезжая.' },
]

const team = [
  { n: 'Глеб', r: 'Основатель, мастер полировки', y: '15 лет в детейлинге' },
  { n: 'Вера', r: 'Плёнки и оклейка', y: '9 лет, 600+ машин' },
  { n: 'Тимур', r: 'Салон и кожа', y: '11 лет' },
  { n: 'Ильдар', r: 'Электрика и опции', y: '8 лет' },
]

const guarantees = [
  { n: '10 лет', t: 'на защитную плёнку PPF' },
  { n: '3 года', t: 'на керамику и цветную плёнку' },
  { n: '1 год', t: 'на установку оборудования' },
]

const faq = [
  { q: 'Нужно ли записываться на диагностику заранее?', a: 'Да, лучше записаться: диагностика занимает около часа, и мы выделяем под неё отдельный бокс со светом. Это бесплатно и ни к чему не обязывает.' },
  { q: 'Можно ли оставить машину на несколько дней?', a: 'Конечно. Большинство работ — от полировки до плёнки — занимают от двух до пяти дней. Машина всё это время находится в закрытом тёплом боксе.' },
  { q: 'Повредит ли плёнка заводской лак при снятии?', a: 'Нет. Качественная полиуретановая и цветная плёнка снимается с прогревом без следов. Мы делаем это сами и даём гарантию на сохранность лака.' },
  { q: 'Сохранится ли заводская гарантия после установки опций?', a: 'Мы используем штатные разъёмы и не режем проводку. Всё оборудование можно демонтировать, вернув машину в заводское состояние.' },
  { q: 'Как перенести или отменить запись?', a: 'В разделе «Мои визиты» — там видны все ваши записи, их можно перенести на другое время или отменить в один клик.' },
]

export default function Atelier() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <PageHead
        eyebrow="Ателье"
        title={<>Тихая работа <em>с деталями</em></>}
        lead="OBSIDIAN появился в 2014 году как мастерская одного полировщика. Сегодня это небольшое ателье с четырьмя боксами и командой, которая не торопится."
      />

      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <Photo k="atelier" className="wide-photo" />
          </Reveal>
          <div className="values">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 70} className="value">
                <span className="step__n">0{i + 1}</span>
                <h2 className="h3">{v.t}</h2>
                <p className="muted">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Команда</p>
            <h2 className="h2">Люди, которым <em>не всё равно</em></h2>
          </Reveal>
          <div className="team">
            {team.map((p, i) => (
              <Reveal key={p.n} delay={i * 70} className="person">
                <div className="person__mono" aria-hidden="true">{p.n[0]}</div>
                <h3 className="person__name">{p.n}</h3>
                <p className="muted small">{p.r}</p>
                <p className="person__years">{p.y}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <Reveal className="split__text">
            <p className="eyebrow">Гарантии</p>
            <h2 className="h2">Отвечаем <em>за результат</em></h2>
            <p className="muted">
              На каждую работу выдаём паспорт с описанием материалов, замерами и сроком гарантии.
              Если что-то пошло не так — исправим за свой счёт.
            </p>
            <div className="guarantees">
              {guarantees.map((g) => (
                <div key={g.t} className="guarantee">
                  <span className="guarantee__n">{g.n}</span>
                  <span className="muted small">{g.t}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="faq">
            <p className="eyebrow">Частые вопросы</p>
            {faq.map((f, i) => (
              <div key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
                <button className="faq__q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  {f.q}
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div className="faq__a" hidden={open !== i}>
                  <p className="muted">{f.a}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
