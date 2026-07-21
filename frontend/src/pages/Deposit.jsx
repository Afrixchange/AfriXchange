import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Deposit() {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState('NGN')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currencies = [
    { code: 'NGN', name: 'Naira' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'USDT', name: 'Tether' }
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    // TODO: Integrate with Paystack in Phase 4
    // For now, simulate a successful deposit
    setTimeout(() => {
      setLoading(false)
      navigate('/deposit/receipt/placeholder-id')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">Deposit</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {currencies.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code)}
                  className={`
                    py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors
                    ${currency === c.code
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }
                  `}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full">
            Continue to Payment
          </Button>
        </form>
      </main>
    </div>
  )
}

