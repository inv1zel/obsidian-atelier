import { useEffect, useRef } from 'react'
import { imageSrc, images } from '../data/images'

// Живой фон первого экрана: фото, к которому привязаны световые слои.
// Координаты слоёв — в процентах от исходного кадра 1672×941.
const IMG_W = 1672
const IMG_H = 941

export default function HeroScene() {
  const box = useRef(null)
  const stage = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    const boxEl = box.current
    const stageEl = stage.current
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    // ——— «object-fit: cover» для сцены с фокусом на машине ———
    let W = 0
    let H = 0
    const fit = () => {
      W = boxEl.clientWidth
      H = boxEl.clientHeight
      const mobile = window.innerWidth <= 640
      const fx = mobile ? 0.56 : 0.68
      const s = Math.max(W / IMG_W, H / IMG_H) * 1.05 // запас под параллакс
      const sw = IMG_W * s
      const sh = IMG_H * s
      Object.assign(stageEl.style, {
        width: `${sw}px`,
        height: `${sh}px`,
        left: `${(W - sw) * fx}px`,
        top: `${(H - sh) * 0.5}px`,
      })
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = W * dpr
      cv.height = H * dpr
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(boxEl)

    // ——— пыль в луче света ———
    const count = reduce ? 0 : W < 640 ? 50 : 110
    const dust = Array.from({ length: count }, () => spawn(true))
    function spawn(anywhere) {
      const bokeh = Math.random() < 0.14
      return {
        x: Math.random(),
        y: anywhere ? Math.random() : 1.05,
        r: bokeh ? 3 + Math.random() * 5 : 0.6 + Math.random() * 1.6,
        bokeh,
        vx: (Math.random() - 0.3) * 0.00012,
        vy: -(0.00004 + Math.random() * 0.00014),
        a: bokeh ? 0.1 + Math.random() * 0.14 : 0.35 + Math.random() * 0.6,
        tw: Math.random() * Math.PI * 2,
        depth: 0.4 + Math.random() * 0.9,
      }
    }
    // пылинки ярче там, где на кадре свет: стена справа и LED-полоса
    const light = (x, y) => {
      const wall = Math.max(0, (x - 0.5) * 2) * (1 - Math.abs(y - 0.35) * 1.2)
      const strip = Math.exp(-((x - 0.6) ** 2) / 0.004) * (y < 0.6 ? 1 : 0.3)
      return Math.min(1, 0.3 + wall * 0.9 + strip)
    }

    // ——— параллакс за курсором ———
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (finePointer && !reduce) window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(boxEl)

    let raf
    let last = performance.now()
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) return
      const dt = Math.min(64, now - last)
      last = now

      px += (tx - px) * 0.04
      py += (ty - py) * 0.04
      stageEl.style.transform = `translate3d(${-px * 16}px, ${-py * 10}px, 0)`

      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.tw += 0.0015 * dt
        if (p.y < -0.05 || p.x < -0.05 || p.x > 1.05) dust[i] = spawn(false)
        const x = p.x * W + px * 26 * p.depth
        const y = p.y * H + py * 16 * p.depth
        const alpha = p.a * light(p.x, p.y) * (0.55 + 0.45 * Math.sin(p.tw))
        const r = p.r * p.depth
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        if (p.bokeh) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r)
          g.addColorStop(0, `rgba(240,234,224,${alpha})`)
          g.addColorStop(1, 'rgba(240,234,224,0)')
          ctx.fillStyle = g
        } else {
          ctx.fillStyle = `rgba(240,234,224,${alpha})`
        }
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const src = imageSrc('hero')
  return (
    <div className="scene" ref={box} aria-hidden="true">
      <div className="scene__stage" ref={stage}>
        <div className="scene__inner">
          <img src={src} alt={images.hero.alt} className="scene__img" />
          {/* LED-полоса на стене */}
          <span className="scene__led" style={{ left: '60.3%', top: '10%', height: '44.5%' }} />
          {/* фары: свечение и отсвет на полу */}
          <span className="scene__lamp" style={{ left: '53.1%', top: '59.2%', width: '9%', height: '7.5%' }} />
          <span className="scene__lamp scene__lamp--r" style={{ left: '75.6%', top: '59%', width: '4.2%', height: '6.5%' }} />
          <span className="scene__floor" style={{ left: '66%', top: '83%', width: '46%', height: '22%' }} />
          {/* блик по отражающим поверхностям — маска по яркости кадра */}
          <span
            className="scene__sweep"
            style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
          />
        </div>
      </div>
      <canvas className="scene__dust" ref={canvas} />
    </div>
  )
}
