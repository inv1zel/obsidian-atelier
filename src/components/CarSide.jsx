import { useId } from 'react'

// Силуэт купе сбоку. Цвет и фактура плёнки задаются пропсами.
const BODY =
  'M30 186 C 30 166, 42 152, 72 147 L 196 129 C 236 123, 262 118, 292 110 ' +
  'C 332 82, 372 64, 424 60 C 484 56, 544 60, 584 74 C 634 92, 684 110, 722 119 ' +
  'C 752 126, 770 138, 772 154 L 773 180 C 773 190, 766 196, 755 196 L 692 196 ' +
  'A 64 64 0 0 0 564 196 L 252 196 A 64 64 0 0 0 124 196 L 52 196 C 38 196, 30 193, 30 186 Z'

const GLASS_FRONT = 'M316 112 C 346 90, 378 76, 418 72 L 470 70 L 466 112 Z'
const GLASS_REAR = 'M482 70 C 520 70, 552 76, 578 88 C 594 96, 604 103, 612 110 L 478 112 Z'

const FINISH = {
  gloss: { shade: 0.55, reflect: 0.55, spec: 0.9 },
  satin: { shade: 0.45, reflect: 0.22, spec: 0.35 },
  matte: { shade: 0.35, reflect: 0, spec: 0.08 },
}

export default function CarSide({ color = '#121214', finish = 'gloss', className = '' }) {
  const id = useId().replace(/:/g, '')
  const f = FINISH[finish] ?? FINISH.gloss
  return (
    <svg className={`car-side ${className}`} viewBox="0 0 800 270" role="img" aria-label="Силуэт автомобиля">
      <defs>
        <clipPath id={`clip${id}`}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={f.shade * 0.5} />
          <stop offset=".38" stopColor="#fff" stopOpacity="0" />
          <stop offset=".62" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={f.shade} />
        </linearGradient>
        <linearGradient id={`refl${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`floor${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity=".7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`rim${id}`} cx="50%" cy="50%" r="50%">
          <stop offset=".55" stopColor="#2a2a2e" />
          <stop offset=".9" stopColor="#0c0c0d" />
        </radialGradient>
      </defs>

      <ellipse cx="400" cy="232" rx="380" ry="16" fill={`url(#floor${id})`} />

      <g className="car-side__paint">
        <path d={BODY} fill={color} style={{ transition: 'fill .6s ease' }} />
        <g clipPath={`url(#clip${id})`}>
          <rect x="0" y="40" width="800" height="170" fill={`url(#shade${id})`} />
          {/* отражение студийной лампы */}
          <path
            d="M120 150 C 300 128, 520 124, 760 136 L 760 146 C 520 136, 300 140, 120 162 Z"
            fill={`url(#refl${id})`}
            opacity={f.reflect}
            style={{ transition: 'opacity .6s ease' }}
          />
          <rect
            className="car-side__sweep"
            x="-200"
            y="40"
            width="90"
            height="170"
            fill="#fff"
            opacity={f.spec * 0.35}
            transform="skewX(-24)"
          />
        </g>
        {/* линии кузова */}
        <path d="M84 158 C 300 140, 520 134, 742 142" stroke="#000" strokeOpacity=".35" fill="none" />
        <path d="M470 116 L 474 190" stroke="#000" strokeOpacity=".4" fill="none" />
        <path d="M300 116 L 316 190" stroke="#000" strokeOpacity=".25" fill="none" />
      </g>

      <path d={GLASS_FRONT} fill="#0a0b0d" />
      <path d={GLASS_REAR} fill="#0a0b0d" />
      <path d="M330 104 C 360 86, 390 78, 430 76" stroke="#fff" strokeOpacity=".12" strokeWidth="3" fill="none" />

      {/* фары */}
      <path d="M40 160 C 52 150, 76 147, 98 146" stroke="#f1e7d4" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".85" />
      <path d="M748 128 L 770 140" stroke="#a31d23" strokeWidth="4" strokeLinecap="round" opacity=".9" />

      {[188, 628].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="196" r="54" fill="#0b0b0c" />
          <circle cx={cx} cy="196" r="40" fill={`url(#rim${id})`} stroke="#3a3a3f" strokeWidth="1.5" />
          {[0, 72, 144, 216, 288].map((a) => (
            <path
              key={a}
              d={`M${cx} 196 L ${cx} 160`}
              stroke="#4a4a50"
              strokeWidth="5"
              strokeLinecap="round"
              transform={`rotate(${a} ${cx} 196)`}
            />
          ))}
          <circle cx={cx} cy="196" r="7" fill="#c8b08a" opacity=".8" />
        </g>
      ))}
    </svg>
  )
}
