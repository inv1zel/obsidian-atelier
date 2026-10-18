import { useEffect, useRef, useState } from 'react'
import { imageSrc, images } from '../data/images'

// Ателье «включается», когда кадр появляется на экране:
// рамки загораются волной из глубины тоннеля, затем машина моргает фарами,
// лампы на стенах живут своей жизнью. Сцена движется с параллаксом.
// Координаты — в процентах исходного кадра 1400×933.
const BULBS = [
  // [x, y, размер] — ближние лампы крупнее
  [20.6, 33.3, 4.2], [25.6, 36.6, 3.2], [20.5, 51.2, 4.2], [25.8, 51.0, 3.2],
  [87.8, 33.3, 4.2], [80.6, 36.5, 3.4], [75.7, 38.6, 2.6], [88.2, 50.8, 4.2], [80.8, 50.8, 3.4], [75.8, 50.7, 2.6],
  [72.1, 40.3, 2.0], [72.2, 50.6, 2.0],
]
// у каждой лампы свой ритм, чтобы мерцание не было синхронным
const RHYTHM = [[5.3, 0.4], [7.1, 2.2], [6.2, 3.9], [8.4, 1.1], [5.9, 2.8], [7.7, 0.9], [6.6, 4.6], [9.1, 1.7], [5.6, 3.3], [8.0, 0.2], [6.9, 2.5], [7.4, 4.1]]

export default function AtelierScene() {
  const ref = useRef(null)
  const par = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // параллакс: прокрутка + лёгкое смещение за курсором
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    const fine = window.matchMedia('(pointer: fine)').matches
    let mx = 0, my = 0, cx = 0, cy = 0, sy = 0, raf
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => { mx = 0; my = 0 }
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight // -1…1
      sy += (p - sy) * 0.12
      cx += (mx - cx) * 0.06
      cy += (my - cy) * 0.06
      par.current.style.transform =
        `translate3d(${-cx * 14}px, ${sy * 46 - cy * 8}px, 0) scale(1.12)`
    }
    raf = requestAnimationFrame(frame)
    if (fine) {
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
    }
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const base = import.meta.env.BASE_URL
  return (
    <div ref={ref} className={`atelier-scene wide-photo ${on ? 'is-on' : ''}`}>
      <div className="atelier-scene__par" ref={par}>
        <div className="atelier-scene__stage">
          <img src={`${base}images/atelier-off.jpg`} alt="" aria-hidden="true" className="atelier-scene__off" />
          <img src={imageSrc('atelier')} alt={images.atelier.alt} className="atelier-scene__lit" />
          {BULBS.map(([x, y, s], i) => (
            <span
              key={i}
              className="atelier-scene__bulb"
              style={{
                left: `${x}%`, top: `${y}%`, width: `${s}%`,
                '--dur': `${RHYTHM[i][0]}s`, '--del': `${3 + RHYTHM[i][1]}s`,
              }}
            />
          ))}
          <span className="atelier-scene__lamp" style={{ left: '38.8%', top: '59.1%', width: '7.5%', height: '6.5%' }} />
          <span className="atelier-scene__lamp" style={{ left: '60.2%', top: '58.8%', width: '7%', height: '6.5%' }} />
          <span className="atelier-scene__floor" />
        </div>
      </div>
    </div>
  )
}
