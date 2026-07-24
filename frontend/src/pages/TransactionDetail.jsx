import { Link, useParams } from 'react-router-dom'
import BottomNav from '../components/nav/BottomNav'
import Sidebar from '../components/nav/Sidebar'
import Button from '../components/ui/Button'
import { useTransactions } from '../features/wallet/useTransactions'

const STATUS_STYLES = {
  success: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-400/10 text-amber-600',
  failed: 'bg-red-500/10 text-red-500',
  held: 'bg-red-500/10 text-red-500',
}

function formatDate(value) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-3 last:border-0">
      <span className="text-sm text-ink/55">{label}</span>
      <span className="text-right text-sm font-medium text-ink break-all">{value || 'N/A'}</span>
    </div>
  )
}

export default function TransactionDetail() {
  const { id } = useParams()
  const { data: transactions = [], isLoading } = useTransactions(100)
  const transaction = transactions.find(tx => tx.id === id)

  return (
    <div className="min-h-screen bg-surface md:flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <Link to="/transactions" className="text-ink/60 hover:text-ink" aria-label="Back to transactions">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-ink">Transaction Details</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
          {isLoading ? (
            <div className="bg-surface-card rounded-xl border border-border-subtle p-12 text-center">
              <p className="text-ink/40">Loading transaction...</p>
            </div>
          ) : !transaction ? (
            <div className="bg-surface-card rounded-xl border border-border-subtle p-8 text-center">
              <h2 className="text-xl font-semibold text-ink">Transaction not found</h2>
              <p className="mt-2 text-sm text-ink/60">This transaction may no longer be available.</p>
              <Link to="/transactions" className="mt-6 inline-block">
                <Button variant="outline">Back to Transactions</Button>
              </Link>
            </div>
          ) : (
            <section className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink/55">Amount</p>
                  <p className="mt-1 font-poppins text-3xl font-semibold text-ink">
                    {Number(transaction.amount_from || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} {transaction.currency_from}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[transaction.status] || 'bg-surface text-ink/60'}`}>
                  {transaction.status || 'unknown'}
                </span>
              </div>

              <DetailRow label="Type" value={transaction.type} />
              <DetailRow label="Reference" value={transaction.provider_ref || transaction.id} />
              <DetailRow label="From" value={transaction.currency_from} />
              <DetailRow label="To" value={transaction.currency_to} />
              <DetailRow label="Rate" value={transaction.rate} />
              <DetailRow label="Created" value={formatDate(transaction.created_at)} />
              <DetailRow label="Updated" value={formatDate(transaction.updated_at)} />

              {transaction.status === 'held' && (
                <Link to={`/transaction/held/${transaction.id}`} className="mt-6 block">
                  <Button variant="outline" className="w-full">View Review Status</Button>
                </Link>
              )}
            </section>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
