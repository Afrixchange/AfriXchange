import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import BalanceCard from '../components/BalanceCard'

export default function Home() {
  const { profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
  }

  // Placeholder wallets data — will be replaced with useWallets hook in Phase 3
  const wallets = [
    { currency: 'NGN', balance: 0, flag: '🇳🇬', name: 'Naira' },
    { currency: 'USD', balance: 0, flag: '🇺🇸', name: 'US Dollar' },
    { currency: 'USDT', balance: 0, flag: '₮', name: 'Tether' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">AfriXchange</h1>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm text-gray-600 hover:text-primary">
              {profile?.full_name || 'Profile'}
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Balances */}
        <section>
          <h2 className="text-lg font-semibold text-dark mb-3">Your Wallets</h2>
          <div className="space-y-3">
            {wallets.map(wallet => (
              <Link key={wallet.currency} to={`/wallet/${wallet.currency}`}>
                <BalanceCard wallet={wallet} />
              </Link>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-3 gap-3">
          <Link to="/deposit">
            <Button variant="primary" className="w-full flex-col py-4 text-xs gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Deposit
            </Button>
          </Link>
          <Link to="/withdraw">
            <Button variant="outline" className="w-full flex-col py-4 text-xs gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Withdraw
            </Button>
          </Link>
          <Link to="/convert">
            <Button variant="secondary" className="w-full flex-col py-4 text-xs gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Convert
            </Button>
          </Link>
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 gap-3">
          <Link to="/transactions"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-dark">Transactions</h3>
            <p className="text-sm text-gray-500 mt-1">View all activity</p>
          </Link>
          <Link to="/help"
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-dark">Help</h3>
            <p className="text-sm text-gray-500 mt-1">Get support</p>
          </Link>
        </section>
      </main>
    </div>
  )
}

