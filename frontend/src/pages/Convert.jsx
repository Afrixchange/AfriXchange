import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useConversionRate } from '../features/convert/useConversionRate'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import RateTimer from '../components/RateTimer'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

export default function Convert() {
  const navigate = useNavigate()
  const [fromCurrency, setFromCurrency] = useState('NGN')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const { data: rateData, isFetching: rateLoading } = useConversionRate(
    amount && parseFloat(amount) > 0 ? fromCurrency : null,
    amount && parseFloat(amount) > 0 ? toCurrency : null
  )

  const currencies = [
    { code: 'NGN', name: 'Naira', flag: '🇳🇬' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'USDT', name: 'Tether', flag: '₮' }
  ]

  function swapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  function getConvertedAmount() {
    if (!rateData?.rate || !amount) return '0.00'
    return (parseFloat(amount) * rateData.rate).toFixed(2)
  }

  function handleProceed() {
    setError('')
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!rateData?.rate) {
      setError('No rate available. Please try again.')
      return
    }
    navigate('/convert/summary', {
      state: {
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount: getConvertedAmount(),
        rate: rateData.rate,
        quoteId: rateData.quoteId,
      }
    })
  }

  const handleRateExpire = useCallback(() => {
    // Rate expired — user needs to get a new rate by re-entering amount
  }, [])

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
            <h1 className="text-xl font-bold text-ink">Convert</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24 md:pb-8">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* From Currency */}
          <div className="bg-surface-card p-4 rounded-xl border border-border-subtle">
            <label className="text-sm font-medium text-ink/60 mb-2 block">From</label>
            <div className="flex gap-2 mb-3">
              {currencies.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setFromCurrency(c.code)}
                  disabled={c.code === toCurrency}
                  className={`
                    py-2 px-3 rounded-xl border text-sm font-medium transition-colors
                    ${fromCurrency === c.code
                      ? 'border-brand bg-surface text-brand'
                      : 'border-border-subtle text-ink/70 hover:border-border-subtle'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
            <Input
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={swapCurrencies}
              className="w-10 h-10 bg-surface-card border border-border-subtle rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div className="bg-surface-card p-4 rounded-xl border border-border-subtle">
            <label className="text-sm font-medium text-ink/60 mb-2 block">To</label>
            <div className="flex gap-2 mb-3">
              {currencies.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setToCurrency(c.code)}
                  disabled={c.code === fromCurrency}
                  className={`
                    py-2 px-3 rounded-xl border text-sm font-medium transition-colors
                    ${toCurrency === c.code
                      ? 'border-brand bg-surface text-brand'
                      : 'border-border-subtle text-ink/70 hover:border-border-subtle'
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
            <Input
              placeholder="0.00"
              type="number"
              value={getConvertedAmount()}
              readOnly
              className="bg-surface"
            />
          </div>

          {/* Rate Display */}
          {(rateData || rateLoading) && (
            <div className="bg-surface-card p-4 rounded-xl border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink/60">Exchange Rate</p>
                  {rateLoading ? (
                    <p className="text-lg font-semibold text-ink">Loading...</p>
                  ) : rateData ? (
                    <p className="text-lg font-semibold text-ink">
                      1 {fromCurrency} = {rateData.rate} {toCurrency}
                    </p>
                  ) : null}
                </div>
                {rateData?.expiresAt && (
                  <RateTimer expiresAt={rateData.expiresAt} onExpire={handleRateExpire} />
                )}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          {rateData?.rate && (
            <Button onClick={handleProceed} className="w-full">
              Continue to Review
            </Button>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

