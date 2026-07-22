import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDeposit } from '../features/deposit/useDeposit'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

export default function Deposit() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultCurrency = searchParams.get('currency') || 'NGN'
  const [currency, setCurrency] = useState(defaultCurrency)
  const [amount, setAmount] = useState('')
  const { mutateAsync: initiateDeposit, isPending: loading, error: submitError } = useDeposit()

  const [localError, setLocalError] = useState('')

  const currencies = [
    { code: 'NGN', name: 'Naira' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'USDT', name: 'Tether' }
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('Please enter a valid amount')
      return
    }

    try {
      const result = await initiateDeposit({ amount: parseFloat(amount), currency })
      navigate(`/deposit/receipt/${result.transactionId || result.ref || 'pending'}`)
    } catch (err) {
      setLocalError(err.message || 'Deposit failed. Please try again.')
    }
  }

  const displayError = localError || (submitError ? submitError.message : '')

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
            <h1 className="text-xl font-bold text-ink">Deposit</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
          <form onSubmit={handleSubmit} className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-4">
            {displayError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {displayError}
              </div>
            )}

            {/* Currency Selector */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`
                      py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors
                      ${currency === c.code
                        ? 'border-brand bg-surface text-brand'
                        : 'border-border-subtle text-ink/70 hover:border-border-subtle'
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
      <BottomNav />
    </div>
  )
}

