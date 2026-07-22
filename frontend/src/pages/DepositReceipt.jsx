import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function DepositReceipt() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-card p-8 rounded-xl border border-border-subtle shadow-sm">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-2">Deposit Pending</h2>
          <p className="text-ink/60 mb-2">
            Your deposit of <span className="font-semibold text-ink">$0.00</span> is being processed.
          </p>
          <p className="text-xs text-ink/40 mb-6">
            Reference: {id || 'N/A'}
          </p>

          <div className="space-y-3">
            <Link to="/home">
              <Button variant="primary" className="w-full">Back to Home</Button>
            </Link>
            <Link to="/transactions">
              <Button variant="ghost" className="w-full">View Transactions</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

