import Reveal from './Reveal'

export default function PageHead({ eyebrow, title, lead, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <Reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h1">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  )
}
