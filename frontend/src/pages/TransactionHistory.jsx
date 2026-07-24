import { Link } from 'react-router-dom'
import { useTransactions } from '../features/wallet/useTransactions'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

const STATUS_COLORS = {
  success: 'text-emerald-600',
  pending: 'text-amber-500',
  failed: 'text-red-500',
  held: 'text-red-500',
}

const TYPE_ICONS = {
  deposit: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  withdraw: 'M20 12H4',
  conversion: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
}

export default function TransactionHistory() {
  const { data: transactions = [], isLoading } = useTransactions(50)

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
            <h1 className="text-xl font-bold text-ink">Transactions</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
          {isLoading ? (
            <div className="bg-surface-card rounded-xl border border-border-subtle p-12 text-center">
              <p className="text-ink/40">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-surface-card rounded-xl border border-border-subtle p-12 text-center">
              <svg className="w-12 h-12 text-ink/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-ink mb-1">No transactions yet</h3>
              <p className="text-ink/60 text-sm mb-4">Your deposit, withdrawal, and conversion activity will appear here.</p>
              <Link
                to="/deposit"
                className="inline-block px-5 py-2 bg-brand text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors"
              >
                Make a Deposit
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <Link
                  key={tx.id}
                  to={tx.status === 'held' ? `/transaction/held/${tx.id}` : `/transaction/${tx.id}`}
                  className="block bg-surface-card rounded-xl border border-border-subtle p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-brand shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={TYPE_ICONS[tx.type] || TYPE_ICONS.deposit} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink capitalize">{tx.type}</p>
                      <p className="text-xs text-ink/40 truncate">{tx.provider_ref || tx.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">
                        {tx.type === 'deposit' ? '+' : '-'}{parseFloat(tx.amount_from || 0).toFixed(2)} {tx.currency_from}
                      </p>
                      <p className={`text-xs font-medium ${STATUS_COLORS[tx.status] || 'text-ink/40'} capitalize`}>{tx.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

