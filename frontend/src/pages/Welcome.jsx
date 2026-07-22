import { Link } from 'react-router-dom'
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
    title: 'Secure & compliant',
    body: 'KYC-verified accounts with bank-grade security and regulatory compliance.',
    d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-card">
        <h1 className="text-2xl font-poppins font-bold text-brand">AfriXchange</h1>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-16 text-center">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-ink mb-6 leading-tight">
            Seamless cross-border{' '}
            <span className="text-brand">financial exchange</span>
          </h2>
          <p className="text-lg text-ink/60 mb-8 max-w-lg mx-auto">
            Deposit, withdraw, and convert between Naira, USD, and USDT — all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Get started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">I already have an account</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          {FEATURES.map(feature => (
            <div key={feature.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-card shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4">
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