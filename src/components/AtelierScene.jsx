import { useEffect, useRef, useState } from 'react'
import { imageSrc, images } from '../data/images'

// Ателье «включается», когда кадр появляется на экране:
// рамки загораются волной из глубины тоннеля, затем машина моргает фарами.
// Координаты фар — в процентах исходного кадра 1400×933.
export default function AtelierScene() {
  const ref = useRef(null)
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

  const base = import.meta.env.BASE_URL
  return (
    <div ref={ref} className={`atelier-scene wide-photo ${on ? 'is-on' : ''}`}>
      <div className="atelier-scene__stage">
        <img src={`${base}images/atelier-off.jpg`} alt="" aria-hidden="true" className="atelier-scene__off" />
        <img src={imageSrc('atelier')} alt={images.atelier.alt} className="atelier-scene__lit" />
        <span className="atelier-scene__lamp" style={{ left: '38.8%', top: '59.1%', width: '7.5%', height: '6.5%' }} />
        <span className="atelier-scene__lamp" style={{ left: '60.2%', top: '58.8%', width: '7%', height: '6.5%' }} />
        <span className="atelier-scene__floor" />
      </div>
    </div>
  )
}
