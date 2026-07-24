import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/ui/Button'

const FEATURES = [
  {
    title: 'Multi-currency wallets',
    body: 'Hold NGN, USD, and USDT in one unified wallet with real-time balance updates.',
    d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Instant conversions',
    body: 'Convert between currencies at competitive rates with rate-lock protection.',
    d: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  },
  {
    title: 'Secure and compliant',
    body: 'KYC-verified accounts with bank-grade security and regulatory compliance.',
    d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface-card/90 backdrop-blur">
        <BrandLogo compact />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 py-10 md:py-14">
        <section className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
              <span className="h-2 w-2 rounded-full bg-accent" />
              NGN, USD and USDT
            </div>
            <h2 className="max-w-3xl text-4xl md:text-6xl font-poppins font-bold text-ink mb-6 leading-tight">
              Exchange money across borders with <span className="text-brand">clarity and control</span>
            </h2>
            <p className="text-lg text-ink/65 mb-8 max-w-xl">
              Deposit, withdraw, and convert between Naira, USD, and USDT in one secure wallet built for fast-moving African finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">Get started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">I already have an account</Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-brand/10" />
            <div className="relative overflow-hidden rounded-[28px] border border-brand/10 bg-surface-card p-5 shadow-2xl shadow-brand/15">
              <div className="rounded-3xl bg-brand p-5 text-white">
                <div className="mb-10 flex items-center justify-between">
                  <BrandLogo to={null} compact className="[&_*]:text-white [&_img]:shadow-none" />
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-brand-dark">Live</span>
                </div>
                <p className="text-sm text-white/65">Total balance</p>
                <p className="mt-1 font-poppins text-4xl font-semibold">NGN 2,450,000</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {['NGN 850k', 'USD 720', 'USDT 410'].map(value => (
                    <div key={value} className="rounded-2xl bg-white/10 p-3">
                      <p className="text-xs text-white/60">{value.split(' ')[0]}</p>
                      <p className="mt-1 font-semibold">{value.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {['Deposit', 'Convert', 'Withdraw'].map(action => (
                  <div key={action} className="rounded-2xl border border-border-subtle bg-surface px-3 py-4 text-center text-sm font-semibold text-ink">
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 mx-auto max-w-6xl w-full">
          {FEATURES.map(feature => (
            <div key={feature.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-card shadow-sm shadow-brand/5">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.d} />
                </svg>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-ink mb-2">{feature.title}</h3>
              <p className="text-ink/60 text-sm">{feature.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border-subtle py-6 px-6 text-center bg-surface-card">
        <p className="text-sm text-ink/40">&copy; {new Date().getFullYear()} AfriXchange. All rights reserved.</p>
      </footer>
    </div>
  )
}
