import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

// Add to index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

const NAV = [
  { to: '/', label: 'Home', d: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10' },
  { to: '/wallets', label: 'Wallets', d: 'M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
  { to: '/transactions', label: 'Transactions', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/help', label: 'Help', d: 'M8.2 8a3.8 3.8 0 117.1 1.9c-.7 1.2-2 1.7-2.3 2.9M12 17h.01M12 21a9 9 0 100-18 9 9 0 000 18z' },
]

const ACTIONS = [
  { to: '/deposit', label: 'Deposit', d: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { to: '/withdraw', label: 'Withdraw', d: 'M20 12H4' },
  { to: '/convert', label: 'Convert', d: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { to: '/transactions', label: 'History', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const WALLET_LABEL = { NGN: '₦ Naira', USD: '$ US Dollar', USDT: '₮ Tether' }

export default function Home() {
  const { profile, signOut } = useAuth()
  const { pathname } = useLocation()
  const [showBalance, setShowBalance] = useState(true)

  async function handleSignOut() {
    await signOut()
  }

  // Placeholder wallets data — will be replaced with useWallets hook in Phase 3
  const wallets = [
    { currency: 'NGN', balance: 0 },
    { currency: 'USD', balance: 0 },
    { currency: 'USDT', balance: 0 },
  ]

  const totalNGN = 0 // placeholder — will sum converted balances in Phase 3
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[#F3EFF9] md:flex">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-[#EAE3F7]">
        <div className="px-6 py-6">
          <span className="font-[Poppins] font-semibold text-lg text-[#3A2E52]">
            <span className="text-[#5B1FB0]">Afri</span>Xchange
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(item => {
            const active = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0] ${
                  active ? 'bg-[#5B1FB0] text-white' : 'text-[#3A2E52]/70 hover:bg-[#F3EFF9] hover:text-[#3A2E52]'
                }`}
              >
                <svg className="w-4.5 h-4.5 shrink-0" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-[#EAE3F7]">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F3EFF9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0]"
          >
            <div className="w-8 h-8 rounded-full bg-[#5B1FB0] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-[#3A2E52] truncate">{profile?.full_name || 'Profile'}</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#3A2E52]/60 hover:bg-[#F3EFF9] hover:text-[#3A2E52] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0]"
          >
            <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">

        {/* Mobile purple hero — hidden on desktop */}
        <header className="md:hidden bg-gradient-to-b from-[#5B1FB0] to-[#7A2FD6] px-4 pt-6 pb-16 rounded-b-[32px]">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-[Poppins] font-semibold">
                  {firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white/60 text-xs">Welcome back</p>
                  <p className="text-white font-[Poppins] font-medium">{firstName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/profile" aria-label="Profile" className="text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                </Link>
                <button onClick={handleSignOut} aria-label="Log out" className="text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-1">Total balance (NGN)</p>
            <div className="flex items-center gap-3">
              <p className="text-white font-[Poppins] font-semibold text-3xl">
                {showBalance ? `₦${totalNGN.toLocaleString()}.00` : '••••••'}
              </p>
              <button
                onClick={() => setShowBalance(v => !v)}
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                className="text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showBalance ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Desktop top bar — hidden on mobile */}
        <header className="hidden md:flex items-center justify-between px-8 py-6">
          <div>
            <p className="text-[#3A2E52]/50 text-sm">Welcome back</p>
            <h1 className="font-[Poppins] font-semibold text-2xl text-[#3A2E52]">{firstName}</h1>
          </div>
        </header>

        <main className="max-w-lg md:max-w-none mx-auto md:mx-0 px-4 md:px-8 -mt-10 md:mt-0 pb-10 md:pb-8">
          <div className="md:grid md:grid-cols-3 md:gap-6 space-y-6 md:space-y-0">

            {/* Left/main column */}
            <div className="md:col-span-2 space-y-6">

              {/* Desktop balance card — hidden on mobile (mobile shows it in the hero above) */}
              <section className="hidden md:block bg-gradient-to-r from-[#5B1FB0] to-[#7A2FD6] rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-1">Total balance (NGN)</p>
                <div className="flex items-center gap-3">
                  <p className="text-white font-[Poppins] font-semibold text-3xl">
                    {showBalance ? `₦${totalNGN.toLocaleString()}.00` : '••••••'}
                  </p>
                  <button
                    onClick={() => setShowBalance(v => !v)}
                    aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    className="text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showBalance ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
                      )}
                    </svg>
                  </button>
                </div>
              </section>

              {/* Quick actions */}
              <section className="bg-white rounded-3xl shadow-lg shadow-[#5B1FB0]/10 p-5 grid grid-cols-4 gap-2">
                {ACTIONS.map(action => (
                  <Link key={action.to} to={action.to} className="flex flex-col items-center gap-2 group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0]">
                    <div className="w-12 h-12 rounded-full bg-[#F3EFF9] group-hover:bg-[#5B1FB0] flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-[#5B1FB0] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.d} />
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium text-[#3A2E52]">{action.label}</span>
                  </Link>
                ))}
              </section>

              {/* Wallets */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-[Poppins] font-semibold text-[#3A2E52]">Your Wallets</h2>
                  <Link to="/wallets" className="text-xs font-medium text-[#5B1FB0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0] rounded">See all</Link>
                </div>
                <div className="space-y-3 md:grid md:grid-cols-3 md:gap-3 md:space-y-0">
                  {wallets.map(wallet => (
                    <Link
                      key={wallet.currency}
                      to={`/wallet/${wallet.currency}`}
                      className="flex items-center justify-between md:flex-col md:items-start md:gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F3EFF9] flex items-center justify-center text-[#5B1FB0] font-semibold text-sm shrink-0">
                          {wallet.currency.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#3A2E52]">{WALLET_LABEL[wallet.currency]}</p>
                          <p className="text-xs text-[#3A2E52]/50">{wallet.currency} Wallet</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:w-full md:justify-between">
                        <p className="font-[Poppins] font-medium text-[#3A2E52]">
                          {showBalance ? wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '••••'}
                        </p>
                        <svg className="w-4 h-4 text-[#3A2E52]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column — desktop only companion panel */}
            <div className="hidden md:block space-y-6">
              <section className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-[Poppins] font-medium text-sm text-[#3A2E52] mb-3">Recent activity</h3>
                <p className="text-sm text-[#3A2E52]/40">No transactions yet.</p>
              </section>

              <section className="bg-gradient-to-r from-[#5B1FB0] to-[#7A2FD6] rounded-2xl p-5">
                <p className="text-white font-[Poppins] font-medium text-sm">Need a hand?</p>
                <p className="text-white/70 text-xs mt-0.5 mb-4">We're here 24/7</p>
                <Link
                  to="/help"
                  className="inline-block bg-white text-[#5B1FB0] text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get support
                </Link>
              </section>
            </div>
          </div>

          {/* Mobile-only promo strip */}
          <section className="md:hidden mt-6 bg-gradient-to-r from-[#5B1FB0] to-[#7A2FD6] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-white font-[Poppins] font-medium text-sm">Need a hand?</p>
              <p className="text-white/70 text-xs mt-0.5">We're here 24/7</p>
            </div>
            <Link
              to="/help"
              className="bg-white text-[#5B1FB0] text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get support
            </Link>
          </section>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#EAE3F7] px-2 py-2 flex items-center justify-around">
        {NAV.map(item => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1FB0] ${
                active ? 'text-[#5B1FB0]' : 'text-[#3A2E52]/40'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}