export default function Logo({ small }) {
  return (
    <span className={`logo ${small ? 'logo--small' : ''}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 20 12 12 22 4 12Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M12 2 14.5 12 12 22 9.5 12Z" fill="currentColor" opacity=".35" />
      </svg>
      <span className="logo__word">OBSIDIAN</span>
    </span>
  )
}
