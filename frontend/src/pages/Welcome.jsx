import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">AfriXchange</h1>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
            Seamless Cross-Border<br />
            <span className="text-primary">Financial Exchange</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto">
            Deposit, withdraw, and convert between Naira, USD, and USDT — all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">I Already Have an Account</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Multi-Currency Wallets</h3>
            <p className="text-gray-500 text-sm">Hold NGN, USD, and USDT in one unified wallet with real-time balance updates.</p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Instant Conversions</h3>
            <p className="text-gray-500 text-sm">Convert between currencies at competitive rates with rate-lock protection.</p>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Secure & Compliant</h3>
            <p className="text-gray-500 text-sm">KYC-verified accounts with bank-grade security and regulatory compliance.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 text-center">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} AfriXchange. All rights reserved.</p>
      </footer>
    </div>
  )
}

