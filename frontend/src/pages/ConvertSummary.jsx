import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useExecuteConversion } from '../features/convert/useExecuteConversion'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

export default function ConvertSummary() {
  const navigate = useNavigate()
  const location = useLocation()
  const { fromCurrency, toCurrency, amount, convertedAmount, rate, quoteId } = location.state || {}
  const [pin, setPin] = useState('')
  const { mutateAsync: executeConversion, isPending: loading, error: submitError } = useExecuteConversion()
  const [localError, setLocalError] = useState('')

  async function handleConfirm(e) {
    e.preventDefault()
    if (!pin || pin.length < 4) {
      setLocalError('Please enter your transaction PIN')
      return
    }

    try {
      const result = await executeConversion({
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        rate,
        pin,
        quoteId,
      })
      navigate(`/convert/receipt/${result.transactionId || 'completed'}`)
    } catch (err) {
      setLocalError(err.message || 'Conversion failed. Please try again.')
    }
  }

  const displayError = localError || (submitError ? submitError.message : '')

  if (!location.state) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-ink/60 mb-4">No conversion data found.</p>
          <Link to="/convert">
            <Button variant="primary">Start New Conversion</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface md:flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <Link to="/convert" className="text-ink/60 hover:text-ink">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-ink">Review Conversion</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24 md:pb-8">
          {/* Summary Card */}
          <div className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-ink/60">You send</span>
              <span className="text-xl font-bold text-ink">
                {parseFloat(amount || 0).toFixed(2)} {fromCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-ink/60">You receive</span>
              <span className="text-xl font-bold text-emerald-600">
                {parseFloat(convertedAmount || 0).toFixed(2)} {toCurrency}
              </span>
            </div>
            <div className="border-t border-border-subtle pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Exchange Rate</span>
                <span className="text-ink font-medium">1 {fromCurrency} = {rate} {toCurrency}</span>
              </div>
            </div>
          </div>

          {/* PIN Entry */}
          <form onSubmit={handleConfirm} className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-4">
            {displayError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {displayError}
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
      <BottomNav />
    </div>
  )
}

