import { Link } from 'react-router-dom'

export default function TransactionHistory() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">Transactions</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-dark mb-1">No transactions yet</h3>
          <p className="text-gray-500 text-sm mb-4">Your deposit, withdrawal, and conversion activity will appear here.</p>
          <Link
            to="/deposit"
            className="inline-block px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Make a Deposit
          </Link>
        </div>
      </main>
    </div>
  )
}

