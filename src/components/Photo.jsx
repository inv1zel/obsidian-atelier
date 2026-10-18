import { useState } from 'react'
import { images, imageSrc } from '../data/images'

// Фото с запасным вариантом: если файла нет — студийный градиент с бликом
export default function Photo({ k, className = '', style, eager, children }) {
  const [failed, setFailed] = useState(false)
  const meta = images[k]
  return (
    <div className={`photo ${failed ? 'photo--fallback' : ''} ${className}`} style={style}>
      {!failed && meta && (
        <img
          src={imageSrc(k)}
          alt={meta.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {failed && <span className="photo__glint" aria-hidden="true" />}
      {children}
    </div>
  )
}
