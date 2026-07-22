import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function TransactionHeld() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-card p-8 rounded-xl border border-border-subtle shadow-sm">
          {/* Shield Alert Icon */}
          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-2">Transaction Held</h2>
          <p className="text-ink/60 mb-2">
            This transaction has been flagged for compliance review.
          </p>
          <p className="text-sm text-ink/40 mb-6">
            Reference: {id || 'N/A'}<br />
            Our team will review and update the status shortly.
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

