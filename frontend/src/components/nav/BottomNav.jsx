import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/home', label: 'Home', d: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10' },
  { to: '/wallets', label: 'Wallets', d: 'M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
  { to: '/transactions', label: 'Transactions', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/profile', label: 'Profile', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-subtle px-2 pb-safe">
      <div className="flex justify-around py-2">
        {NAV.map(item => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors
                ${active ? 'text-brand' : 'text-ink/40 hover:text-ink/60'}
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d={item.d} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
