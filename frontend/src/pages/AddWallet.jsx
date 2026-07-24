import { Link } from 'react-router-dom'
import BottomNav from '../components/nav/BottomNav'
import Sidebar from '../components/nav/Sidebar'
import Button from '../components/ui/Button'
import { useWallets } from '../features/wallet/useWallets'

const CURRENCIES = [
  {
    code: 'NGN',
    name: 'Naira',
    glyph: 'NGN',
    description: 'Deposit and withdraw through supported local payment channels.',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    glyph: 'USD',
    description: 'Hold dollar balances and convert from your other wallets.',
  },
  {
    code: 'USDT',
    name: 'Tether',
    glyph: 'USDT',
    description: 'Keep stablecoin value available for fast conversions.',
  },
]

export default function AddWallet() {
  const { data: wallets = [], isLoading } = useWallets()
  const activeCurrencies = new Set(wallets.map(wallet => wallet.currency))

  return (
    <div className="min-h-screen bg-surface md:flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Link to="/wallets" className="text-ink/60 hover:text-ink" aria-label="Back to wallets">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-ink">Add Wallet</h1>
              <p className="text-sm text-ink/55">Manage the currencies available on your account.</p>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8 space-y-6">
          <section className="rounded-2xl bg-brand p-5 text-white shadow-lg shadow-brand/10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Supported wallets</p>
            <h2 className="mt-3 font-poppins text-2xl font-semibold">NGN, USD, and USDT are ready to use.</h2>
            <p className="mt-2 text-sm text-white/65">
              AfriXchange creates supported currency wallets automatically for your account. Use the actions below to fund, withdraw, or convert.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {CURRENCIES.map(currency => {
              const active = activeCurrencies.has(currency.code)
              return (
                <article key={currency.code} className="rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-sm font-bold text-brand">
                      {currency.glyph}
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active || isLoading ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-400/10 text-amber-600'}`}>
                      {isLoading ? 'Checking' : active ? 'Active' : 'Available'}
                    </span>
                  </div>
                  <h3 className="font-poppins text-lg font-semibold text-ink">{currency.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">{currency.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link to={`/deposit?currency=${currency.code}`}>
                      <Button variant="secondary" size="sm" className="w-full">Deposit</Button>
                    </Link>
                    <Link to={`/convert?from=${currency.code}`}>
                      <Button variant="outline" size="sm" className="w-full">Convert</Button>
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="rounded-2xl border border-dashed border-border-subtle bg-surface-card p-5">
            <h2 className="font-poppins font-semibold text-ink">More currencies</h2>
            <p className="mt-1 text-sm text-ink/60">
              Additional wallets will appear here when new currencies are supported.
            </p>
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
