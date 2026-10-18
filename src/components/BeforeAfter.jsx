import { useCallback, useRef, useState } from 'react'
import Photo from './Photo'

// Слайдер «до / после». «До» — тот же кадр с тусклым лаком и паутинкой царапин.
export default function BeforeAfter({ image, label }) {
  const [pos, setPos] = useState(50)
  const box = useRef(null)

  const moveTo = useCallback((clientX) => {
    const r = box.current.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onPointerMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
  }

  return (
    <div
      className="ba"
      ref={box}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      style={{ '--pos': `${pos}%` }}
    >
      <Photo k={image} className="ba__after" />
      <div className="ba__before" aria-hidden="true">
        <Photo k={image} />
        <span className="ba__swirls" />
      </div>
      <span className="ba__tag ba__tag--l">До</span>
      <span className="ba__tag ba__tag--r">После</span>
      <div
        className="ba__handle"
        role="slider"
        tabIndex={0}
        aria-label={`Сравнение до и после: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKey}
      >
        <span className="ba__knob">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </div>
    </div>
  )
}
