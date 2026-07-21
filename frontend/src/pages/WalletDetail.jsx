import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const walletInfo = {
  NGN: { name: 'Naira', flag: '🇳🇬', symbol: '₦' },
  USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  USDT: { name: 'Tether', flag: '₮', symbol: '₮' }
}

export default function WalletDetail() {
  const { currency } = useParams()
  const info = walletInfo[currency] || { name: currency, flag: '', symbol: '' }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">{info.flag} {currency} Wallet</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80">{info.name} Balance</p>
          <p className="text-4xl font-bold mt-1">{info.symbol}0.00</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/deposit">
            <Button variant="primary" className="w-full">Deposit</Button>
          </Link>
          <Link to="/withdraw">
            <Button variant="outline" className="w-full">Withdraw</Button>
          </Link>
        </div>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-dark">Recent Activity</h2>
            <Link to="/transactions" className="text-sm text-primary hover:underline">See all</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400">No transactions yet</p>
          </div>
        </section>
      </main>
    </div>
  )
}

