import { Link, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function WithdrawReceipt() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          {/* Clock Icon for Pending */}
          <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-dark mb-2">Withdrawal Pending</h2>
          <p className="text-gray-500 mb-2">
            Your withdrawal request is being processed.
          </p>
          <p className="text-xs text-gray-400 mb-6">
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

