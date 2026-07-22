import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useWithdraw } from '../features/withdraw/useWithdraw'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

export default function Withdraw() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultCurrency = searchParams.get('currency') || 'NGN'
  const [currency, setCurrency] = useState(defaultCurrency)
  const [amount, setAmount] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [bankCode, setBankCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const { mutateAsync: initiateWithdraw, isPending: loading, error: submitError } = useWithdraw()
  const [localError, setLocalError] = useState('')

  const currencies = [
    { code: 'NGN', name: 'Naira' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'USDT', name: 'Tether' }
  ]

  function handleProceed(e) {
    e.preventDefault()
    setLocalError('')

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('Please enter a valid amount')
      return
    }
    if (!bankCode || !accountNumber) {
      setLocalError('Please enter bank details')
      return
    }

    setShowPin(true)
  }

  async function handlePinSubmit(e) {
    e.preventDefault()
    if (pin.length < 4) {
      setLocalError('Please enter your transaction PIN')
      return
    }

    try {
      const result = await initiateWithdraw({
        amount: parseFloat(amount),
        currency,
        pin,
        bankDetails: {
          bank_code: bankCode,
          account_number: accountNumber,
          account_name: accountName || 'Self',
        }
      })
      navigate(`/withdraw/receipt/${result.transactionId || 'pending'}`)
    } catch (err) {
      setLocalError(err.message || 'Withdrawal failed. Please try again.')
    }
  }

  const displayError = localError || (submitError ? submitError.message : '')

  if (showPin) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-surface-card p-8 rounded-xl border border-border-subtle shadow-sm text-center">
            <h2 className="text-xl font-bold text-ink mb-2">Enter Transaction PIN</h2>
            <p className="text-ink/60 text-sm mb-6">
              Confirm withdrawal of {currency} {parseFloat(amount || 0).toFixed(2)}
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              {displayError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {displayError}
                </div>
              )}

              <Input
                label="Transaction PIN"
                type="password"
                placeholder="Enter your 4-digit PIN"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />

              <Button type="submit" loading={loading} className="w-full">
                Confirm Withdrawal
              </Button>

              <button
                type="button"
                onClick={() => setShowPin(false)}
                className="text-sm text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
            </form>
          </div>
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
            <Link to="/home" className="text-ink/60 hover:text-ink">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-ink">Withdraw</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-8">
          <form onSubmit={handleProceed} className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-4">
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

            <Input
              label="Bank Code (e.g. 044 for Access Bank)"
              placeholder="044"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
            />

            <Input
              label="Account Number"
              placeholder="0123456789"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />

            <Input
              label="Account Name (optional)"
              placeholder="John Doe"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

