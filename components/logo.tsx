export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Person silhouette */}
          <circle cx="14" cy="12" r="5" fill="#0B1633" />
          <path d="M6 28C6 22.4772 10.4772 18 16 18H12C17.5228 18 22 22.4772 22 28V32H6V28Z" fill="#0B1633" />

          {/* Robot */}
          <rect x="22" y="8" width="14" height="12" rx="2" fill="#1ABC9C" />
          <circle cx="26" cy="14" r="2" fill="#0B1633" />
          <circle cx="32" cy="14" r="2" fill="#0B1633" />
          <rect x="25" y="22" width="8" height="8" rx="1" fill="#1ABC9C" />

          {/* Checkmark */}
          <circle cx="32" cy="32" r="7" fill="#7D5CFF" />
          <path d="M29 32L31 34L35 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-xl font-bold text-secondary">
        Confident<span className="text-primary">Me</span>
      </span>
    </div>
  )
}
