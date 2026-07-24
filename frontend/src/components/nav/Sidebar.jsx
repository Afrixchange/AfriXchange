import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '../BrandLogo'
import ThemeToggle from '../ThemeToggle'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', d: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10' },
  { to: '/wallets', label: 'Wallets', d: 'M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
  { to: '/transactions', label: 'Transactions', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/help', label: 'Help', d: 'M8.2 8a3.8 3.8 0 117.1 1.9c-.7 1.2-2 1.7-2.3 2.9M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-card border-r border-border-subtle min-h-screen fixed top-0 left-0">
      <div className="p-6 border-b border-border-subtle">
        <BrandLogo to="/home" compact />
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${active ? 'bg-brand text-white shadow-sm shadow-brand/20' : 'text-ink/60 hover:bg-surface hover:text-ink'}
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
              </svg>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border-subtle">
        <div className="mb-2 px-4">
          <ThemeToggle />
        </div>
        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink/60 hover:bg-surface hover:text-ink transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </Link>
      </div>
    </aside>
  )
}
