import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ConvertSummary() {
  const navigate = useNavigate()
  const location = useLocation()
  const { fromCurrency, toCurrency, amount, convertedAmount, rate } = location.state || {}
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm(e) {
    e.preventDefault()
    if (!pin || pin.length < 4) {
      setError('Please enter your transaction PIN')
      return
    }

    setLoading(true)
    // TODO: Integrate with execute-conversion Edge Function in Phase 6
    setTimeout(() => {
      setLoading(false)
      navigate('/convert/receipt/placeholder-id')
    }, 1500)
  }

  if (!location.state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No conversion data found.</p>
          <Link to="/convert">
            <Button variant="primary">Start New Conversion</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/convert" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">Review Conversion</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">You send</span>
            <span className="text-xl font-bold text-dark">
              {parseFloat(amount || 0).toFixed(2)} {fromCurrency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">You receive</span>
            <span className="text-xl font-bold text-success">
              {parseFloat(convertedAmount || 0).toFixed(2)} {toCurrency}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Exchange Rate</span>
              <span className="text-dark font-medium">1 {fromCurrency} = {rate} {toCurrency}</span>
            </div>
          </div>
        </div>

        {/* PIN Entry */}
        <form onSubmit={handleConfirm} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Transaction PIN"
            type="password"
            placeholder="Enter your 4-digit PIN to confirm"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          />

          <Button type="submit" loading={loading} className="w-full">
            Confirm Conversion
          </Button>
        </form>
      </main>
    </div>
  )
}

