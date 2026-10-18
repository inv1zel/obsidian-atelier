// Силуэты классов автомобиля для мастера записи (передом вправо).
const SHAPES = {
  sedan: {
    body: 'M14 66 C14 58 18 54 28 52 L60 46 C72 34 88 28 110 27 L138 27 C154 27 166 34 178 44 L214 50 C224 52 228 58 228 64 L228 70 C228 72 226 73 224 73 L198 73 A16 16 0 0 0 166 73 L78 73 A16 16 0 0 0 46 73 L18 73 C15 73 14 71 14 68 Z',
    glass: ['M68 46 C80 36 92 31 110 31 L119 31 L119 46 Z', 'M125 31 L138 31 C150 31 160 37 170 46 L125 46 Z'],
    line: 'M30 56 C90 50 170 50 222 56',
    wheels: [62, 182], cy: 73, r: 14,
  },
  crossover: {
    body: 'M14 64 C14 54 20 50 30 49 L52 46 C64 30 78 22 100 21 L150 21 C166 21 178 28 190 42 L214 46 C224 48 228 54 228 62 L228 68 C228 71 226 72 223 72 L200 72 A18 18 0 0 0 164 72 L80 72 A18 18 0 0 0 44 72 L18 72 C15 72 14 70 14 67 Z',
    glass: ['M60 45 C70 32 82 25 100 25 L117 25 L117 45 Z', 'M123 25 L150 25 C162 25 172 32 180 44 L123 45 Z'],
    line: 'M28 55 C90 49 170 49 222 55',
    wheels: [62, 182], cy: 72, r: 15.5,
  },
  suv: {
    body: 'M16 66 L16 46 C16 42 18 40 22 40 L40 40 L52 18 C53 15 55 14 58 14 L168 14 C172 14 174 16 175 19 L182 40 L220 42 C225 42 228 46 228 50 L228 68 C228 71 226 72 223 72 L200 72 A18 18 0 0 0 164 72 L80 72 A18 18 0 0 0 44 72 L20 72 C17 72 16 70 16 67 Z',
    glass: ['M60 38 L68 19 L106 19 L106 38 Z', 'M112 19 L150 19 L150 38 L112 38 Z', 'M156 19 L168 19 L174 38 L156 38 Z'],
    line: 'M22 52 L224 52',
    wheels: [62, 182], cy: 72, r: 15.5,
  },
  super: {
    body: 'M10 62 C10 56 14 52 22 50 L60 42 C80 30 100 24 126 23 C146 23 160 28 176 38 L222 52 C230 55 232 60 232 64 L232 68 C232 71 230 72 227 72 L196 72 A16 16 0 0 0 164 72 L76 72 A16 16 0 0 0 44 72 L14 72 C11 72 10 70 10 67 Z',
    glass: ['M92 38 C104 30 116 27 128 27 C142 27 152 31 162 38 L94 40 Z'],
    line: 'M24 56 C80 50 160 50 226 60',
    wheels: [60, 180], cy: 72, r: 14,
  },
}

export default function ClassCar({ type }) {
  const s = SHAPES[type]
  const id = `cc-${type}`
  return (
    <svg className="class-car" viewBox="0 0 240 90" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="10" x2="0" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0" className="class-car__hi" />
          <stop offset=".5" className="class-car__mid" />
          <stop offset="1" className="class-car__lo" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity=".9" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy={s.cy + 2} rx="112" ry="6" fill={`url(#${id}-shadow)`} />
      {s.wheels.map((x) => (
        <circle key={`n${x}`} cx={x} cy={s.cy} r={s.r + 3} fill="#050506" />
      ))}
      <path d={s.body} fill={`url(#${id}-paint)`} className="class-car__body" />
      <path d={s.line} fill="none" className="class-car__line" />
      {s.glass.map((g) => (
        <path key={g} d={g} className="class-car__glass" />
      ))}
      {s.wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy={s.cy} r={s.r} fill="#0b0b0c" />
          <circle cx={x} cy={s.cy} r={s.r * 0.66} className="class-car__rim" />
          <circle cx={x} cy={s.cy} r={s.r * 0.2} fill="#0b0b0c" />
        </g>
      ))}
    </svg>
  )
}
