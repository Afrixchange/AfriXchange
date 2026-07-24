import { Link } from 'react-router-dom'

export default function BrandLogo({ to = '/', compact = false, className = '' }) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src="/logo.jpeg"
        alt=""
        className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} rounded-2xl object-cover shadow-sm shadow-brand/15`}
      />
      <span className="leading-tight">
        <span className={`${compact ? 'text-lg' : 'text-2xl'} block font-poppins font-bold text-brand`}>
          AfriXchange
        </span>
        {!compact && (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-dark">
            The African Exchange
          </span>
        )}
      </span>
    </span>
  )

  if (!to) return content

  return (
    <Link to={to} className="inline-flex rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
      {content}
    </Link>
  )
}
