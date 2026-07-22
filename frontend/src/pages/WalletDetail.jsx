import { useParams, Link } from 'react-router-dom'
import { useWallets } from '../features/wallet/useWallets'
import { useTransactions } from '../features/wallet/useTransactions'
import Button from '../components/ui/Button'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

const walletInfo = {
  NGN: { name: 'Naira', flag: '🇳🇬', symbol: '₦' },
  USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  USDT: { name: 'Tether', flag: '₮', symbol: '₮' }
}

const STATUS_COLORS = {
  success: 'text-emerald-600',
  pending: 'text-amber-500',
  failed: 'text-red-500',
  held: 'text-red-500',
}

export default function WalletDetail() {
  const { currency } = useParams()
  const info = walletInfo[currency] || { name: currency, flag: '', symbol: '' }
  const { data: wallets = [] } = useWallets()
  const { data: transactions = [] } = useTransactions(10)

  const wallet = wallets.find(w => w.currency === currency)
  const balance = parseFloat(wallet?.balance || 0)

  const walletTransactions = transactions.filter(tx =>
    tx.currency_from === currency || tx.currency_to === currency
  )

  return (
    <div className="min-h-screen bg-surface md:flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <Link to="/home" className="text-ink/60 hover:text-ink">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-ink">{info.flag} {currency} Wallet</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24 md:pb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white">
            <p className="text-sm opacity-80">{info.name} Balance</p>
            <p className="text-4xl font-bold mt-1">{info.symbol}{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link to={`/deposit?currency=${currency}`}>
              <Button variant="primary" className="w-full">Deposit</Button>
            </Link>
            <Link to={`/withdraw?currency=${currency}`}>
              <Button variant="outline" className="w-full">Withdraw</Button>
            </Link>
          </div>

          {/* Recent Transactions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-ink">Recent Activity</h2>
              <Link to="/transactions" className="text-sm text-brand hover:underline">See all</Link>
            </div>
            {walletTransactions.length === 0 ? (
              <div className="bg-surface-card rounded-xl border border-border-subtle p-8 text-center">
                <p className="text-ink/40">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {walletTransactions.map(tx => (
                  <div key={tx.id} className="bg-surface-card rounded-xl border border-border-subtle p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink capitalize">{tx.type}</p>
                      <p className="text-xs text-ink/40">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${STATUS_COLORS[tx.status] || 'text-ink/60'}`}>
                        {tx.status === 'success' ? '+' : ''}{parseFloat(tx.amount_from || 0).toFixed(2)} {tx.currency_from}
                      </p>
                      <p className="text-xs text-ink/40 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

