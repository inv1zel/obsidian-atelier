import { useId } from 'react'

// Студийный «рендер» купе сбоку (передом вправо).
// Глубину дают слои: отражение неба над линией горизонта, тёмная земля под ней,
// блики на арках и крыше, затенение кромок и отражение в полу.

const GROUND = 332
const WHEELS = [245, 752]

const BODY =
  'M96 290 C 86 286, 82 272, 82 258 C 82 242, 86 232, 98 224 ' +
  'C 170 186, 270 136, 360 112 C 410 98, 470 92, 520 96 ' +
  'C 560 100, 600 120, 640 150 C 652 158, 664 164, 680 166 ' +
  'C 740 172, 810 180, 862 192 C 900 200, 926 214, 934 236 ' +
  'C 940 254, 938 276, 928 290 L 822 292 A 73 73 0 0 0 682 292 ' +
  'L 316 292 A 73 73 0 0 0 174 292 L 110 292 C 104 292, 99 291, 96 290 Z'

const GLASS =
  'M380 146 C 400 120, 450 104, 515 104 C 552 106, 586 124, 612 150 ' +
  'C 616 155, 613 158, 606 158 L 396 158 C 386 157, 380 152, 380 146 Z'

const HORIZON = 'M60 236 C 150 206, 300 196, 400 220 C 500 238, 620 236, 690 214 C 770 192, 880 206, 960 240'

const FINISH = {
  gloss: { sky: 0.42, ground: 0.62, blur: 0, spec: 0.85, line: 0.55 },
  satin: { sky: 0.3, ground: 0.45, blur: 5, spec: 0.35, line: 0.2 },
  matte: { sky: 0.13, ground: 0.3, blur: 12, spec: 0.08, line: 0 },
}

export default function CarSide({ color = '#121214', finish = 'gloss', className = '' }) {
  const id = useId().replace(/:/g, '')
  const f = FINISH[finish] ?? FINISH.gloss
  const u = (name) => `url(#${name}${id})`

  const car = (
    <>
      {/* колёсные ниши */}
      {WHEELS.map((cx) => (
        <circle key={`w${cx}`} cx={cx} cy="272" r="70" fill="#050506" />
      ))}

      {/* кузов */}
      <path d={BODY} fill={color} style={{ transition: 'fill .7s ease' }} />
      <g clipPath={u('body')}>
        <g filter={f.blur ? u('soft') : undefined}>
          {/* небо над горизонтом */}
          <path d={`${HORIZON} L 960 40 L 60 40 Z`} fill={u('sky')} opacity={f.sky} />
          {/* земля под горизонтом */}
          <path d={`${HORIZON} L 960 320 L 60 320 Z`} fill={u('ground')} opacity={f.ground} />
          {/* линия горизонта */}
          <path d={HORIZON} stroke="#fff" strokeWidth="1.6" fill="none" opacity={f.line} />
        </g>
        {/* блики */}
        <g filter={u('spec')} opacity={f.spec} fill="#fff">
          <ellipse cx="236" cy="200" rx="92" ry="9" transform="rotate(-14 236 200)" />
          <path d="M175 236 C 200 206, 290 200, 318 230" stroke="#fff" strokeWidth="5" fill="none" />
          <path d="M684 230 C 710 200, 790 196, 822 226" stroke="#fff" strokeWidth="4" fill="none" />
          <ellipse cx="470" cy="100" rx="70" ry="3.5" transform="rotate(-2 470 100)" />
          <ellipse cx="780" cy="182" rx="80" ry="4" transform="rotate(7 780 182)" />
          <ellipse cx="900" cy="214" rx="18" ry="5" transform="rotate(34 900 214)" />
        </g>
        {/* затенение кромок и арок */}
        <path d={BODY} fill="none" stroke="#000" strokeWidth="26" opacity=".42" filter={u('ao')} />
        {WHEELS.map((cx) => (
          <circle key={`ao${cx}`} cx={cx} cy="272" r="76" fill="none" stroke="#000" strokeWidth="12" opacity=".55" filter={u('ao')} />
        ))}
        {/* порог */}
        <path d="M316 292 L 682 292 L 676 276 C 560 272, 440 272, 322 276 Z" fill="#000" opacity=".35" />
        {/* пробегающий блик */}
        <rect className="car-side__sweep" x="-260" y="40" width="120" height="300" fill={u('sweep')} opacity={f.spec * 0.6} transform="skewX(-22)" />
      </g>

      {/* световой кант по верхней линии */}
      <path
        d="M98 224 C 170 186, 270 136, 360 112 C 410 98, 470 92, 520 96 C 560 100, 600 120, 640 150"
        fill="none" stroke="#fff" strokeWidth="1.2" opacity={0.18 + f.spec * 0.2}
      />

      {/* стёкла */}
      <path d={GLASS} fill={u('glass')} stroke="#050505" strokeWidth="5" strokeLinejoin="round" />
      <path d="M400 142 C 430 118, 470 110, 510 110" stroke="#fff" strokeWidth="2" opacity=".14" fill="none" />
      <path d="M470 104 L 480 158" stroke="#050505" strokeWidth="7" />

      {/* линии дверей и ручка */}
      <path d="M486 164 C 488 210, 489 250, 494 286" stroke="#000" strokeOpacity=".55" strokeWidth="1.5" fill="none" />
      <path d="M641 168 C 650 198, 660 228, 667 256" stroke="#000" strokeOpacity=".5" strokeWidth="1.5" fill="none" />
      <rect x="512" y="181" width="36" height="6" rx="3" fill="#000" opacity=".45" />
      <rect x="512" y="180" width="36" height="2" rx="1" fill="#fff" opacity=".18" />

      {/* зеркало */}
      <path d="M618 162 C 622 150, 640 146, 654 151 C 660 155, 656 165, 646 167 L 626 170 Z" fill={color} style={{ transition: 'fill .7s ease' }} />
      <path d="M618 162 C 622 150, 640 146, 654 151 C 660 155, 656 165, 646 167 L 626 170 Z" fill={u('mirror')} />

      {/* фара и фонарь */}
      <g transform="rotate(14 846 198)">
        <ellipse cx="846" cy="198" rx="34" ry="13" fill="#0b0c0e" />
        <ellipse cx="846" cy="198" rx="30" ry="10" fill={u('lamp')} />
        <ellipse cx="838" cy="198" rx="8" ry="5" fill="#fff" opacity=".85" />
        <path d="M820 205 C 832 209, 858 209, 872 203" stroke="#e8f1ff" strokeWidth="2" strokeLinecap="round" opacity=".9" fill="none" />
      </g>
      <path d="M88 236 C 98 228, 114 222, 134 216" stroke="#b3141c" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M88 236 C 98 228, 114 222, 134 216" stroke="#ff4a50" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".8" />
      {/* диффузор и сплиттер */}
      <path d="M92 290 C 120 293, 150 293, 172 292 L 170 280 C 140 281, 112 279, 92 276 Z" fill="#070708" />
      <path d="M826 292 L 926 291 C 932 289, 936 284, 937 278 L 840 282 Z" fill="#070708" />

      {/* колёса */}
      {WHEELS.map((cx) => (
        <Wheel key={cx} cx={cx} cy={272} u={u} />
      ))}
    </>
  )

  return (
    <svg className={`car-side ${className}`} viewBox="0 0 1000 420" role="img" aria-label="Автомобиль в выбранном цвете">
      <defs>
        <clipPath id={`body${id}`}><path d={BODY} /></clipPath>
        <linearGradient id={`sky${id}`} x1="0" y1="40" x2="0" y2="224" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".15" />
          <stop offset=".75" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`ground${id}`} x1="0" y1="214" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset=".55" stopColor="#000" stopOpacity=".55" />
          <stop offset="1" stopColor="#000" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id={`glass${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a3038" />
          <stop offset=".5" stopColor="#0c0e11" />
          <stop offset="1" stopColor="#15181c" />
        </linearGradient>
        <linearGradient id={`mirror${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".5" />
        </linearGradient>
        <radialGradient id={`lamp${id}`} cx="40%" cy="45%" r="60%">
          <stop offset="0" stopColor="#f2f6ff" />
          <stop offset=".5" stopColor="#8f98a6" />
          <stop offset="1" stopColor="#2a2e35" />
        </radialGradient>
        <linearGradient id={`sweep${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`rim${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4c9ce" />
          <stop offset=".42" stopColor="#4d5258" />
          <stop offset=".58" stopColor="#202226" />
          <stop offset="1" stopColor="#70757b" />
        </linearGradient>
        <radialGradient id={`tire${id}`} cx="50%" cy="50%" r="50%">
          <stop offset=".72" stopColor="#141416" />
          <stop offset=".86" stopColor="#1e1f22" />
          <stop offset="1" stopColor="#09090a" />
        </radialGradient>
        <radialGradient id={`disc${id}`} cx="50%" cy="50%" r="50%">
          <stop offset=".3" stopColor="#2a2c30" />
          <stop offset=".9" stopColor="#4b4f55" />
          <stop offset="1" stopColor="#2a2c30" />
        </radialGradient>
        <radialGradient id={`floor${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity=".85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fade${id}`} x1="0" y1={GROUND} x2="0" y2={GROUND + 90} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`reflmask${id}`}>
          <rect x="0" y={GROUND} width="1000" height="100" fill={u('fade')} />
        </mask>
        <filter id={`soft${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={f.blur || 0.01} />
        </filter>
        <filter id={`spec${id}`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation={finish === 'gloss' ? 2.5 : 8} />
        </filter>
        <filter id={`ao${id}`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`blur${id}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* отражение в полу */}
      <g mask={u('reflmask')}>
        <g transform={`translate(0 ${GROUND * 2}) scale(1 -1)`} opacity=".35" filter={u('blur')}>
          {car}
        </g>
      </g>

      {/* тень */}
      <ellipse cx="505" cy={GROUND} rx="450" ry="16" fill={u('floor')} />
      {WHEELS.map((cx) => (
        <ellipse key={cx} cx={cx} cy={GROUND} rx="70" ry="6" fill="#000" opacity=".9" />
      ))}

      <g className="car-side__paint">{car}</g>
    </svg>
  )
}

function Wheel({ cx, cy, u }) {
  const spokes = [0, 72, 144, 216, 288]
  return (
    <g>
      <circle cx={cx} cy={cy} r="65" fill={u('tire')} />
      <circle cx={cx} cy={cy} r="58" fill="none" stroke="#26272a" strokeWidth="1.2" />
      {/* обод */}
      <circle cx={cx} cy={cy} r="51" fill={u('rim')} />
      <circle cx={cx} cy={cy} r="47" fill="#0c0d0f" />
      {/* тормозной диск и суппорт */}
      <circle cx={cx} cy={cy} r="39" fill={u('disc')} />
      <circle cx={cx} cy={cy} r="20" fill="#18191c" />
      <path
        d={`M ${cx + 16} ${cy - 33} A 37 37 0 0 1 ${cx + 37} ${cy - 2} L ${cx + 27} ${cy - 2} A 27 27 0 0 0 ${cx + 12} ${cy - 24} Z`}
        fill="#9aa0a7"
      />
      {/* спицы */}
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
          {[-8, 8].map((o) => (
            <path
              key={o}
              transform={`rotate(${o} ${cx} ${cy})`}
              d={`M ${cx - 3.5} ${cy - 9} L ${cx + 3.5} ${cy - 9} L ${cx + 5.5} ${cy - 47} L ${cx - 5.5} ${cy - 47} Z`}
              fill={u('rim')}
            />
          ))}
        </g>
      ))}
      <circle cx={cx} cy={cy} r="51" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r="11" fill={u('rim')} />
      <circle cx={cx} cy={cy} r="4" fill="#0c0d0f" />
    </g>
  )
}
