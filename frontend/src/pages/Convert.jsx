import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import RateTimer from '../components/RateTimer'

export default function Convert() {
  const navigate = useNavigate()
  const [fromCurrency, setFromCurrency] = useState('NGN')
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rate, setRate] = useState(null)
  const [rateExpiresAt, setRateExpiresAt] = useState(null)

  const currencies = [
    { code: 'NGN', name: 'Naira', flag: '🇳🇬' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'USDT', name: 'Tether', flag: '₮' }
  ]

  // Fetch conversion rate when currencies or amount change
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setRate(null)
      return
    }

    // Simulated rate fetch — will be replaced with Edge Function in Phase 6
    const mockRate = fromCurrency === 'NGN' && toCurrency === 'USD' ? 0.00066
      : fromCurrency === 'USD' && toCurrency === 'NGN' ? 1515
      : fromCurrency === 'NGN' && toCurrency === 'USDT' ? 0.00066
      : fromCurrency === 'USDT' && toCurrency === 'NGN' ? 1515
      : fromCurrency === 'USD' && toCurrency === 'USDT' ? 1
      : fromCurrency === 'USDT' && toCurrency === 'USD' ? 1
      : 1

    setRate(mockRate)
    setRateExpiresAt(Date.now() + 60000) // 60 second rate lock
  }, [fromCurrency, toCurrency, amount])

  function swapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  function getConvertedAmount() {
    if (!rate || !amount) return '0.00'
    return (parseFloat(amount) * rate).toFixed(2)
  }

  function handleProceed() {
    setError('')
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    navigate('/convert/summary', {
      state: {
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount: getConvertedAmount(),
        rate
      }
    })
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
          <h1 className="text-xl font-bold text-dark">Convert</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* From Currency */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-500 mb-2 block">From</label>
          <div className="flex gap-2 mb-3">
            {currencies.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => setFromCurrency(c.code)}
                disabled={c.code === toCurrency}
                className={`
                  py-2 px-3 rounded-lg border text-sm font-medium transition-colors
                  ${fromCurrency === c.code
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-500 mb-2 block">To</label>
          <div className="flex gap-2 mb-3">
            {currencies.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => setToCurrency(c.code)}
                disabled={c.code === fromCurrency}
                className={`
                  py-2 px-3 rounded-lg border text-sm font-medium transition-colors
                  ${toCurrency === c.code
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
            className="bg-gray-50"
          />
        </div>

        {/* Rate Display */}
        {rate && (
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Exchange Rate</p>
                <p className="text-lg font-semibold text-dark">
                  1 {fromCurrency} = {rate} {toCurrency}
                </p>
              </div>
              {rateExpiresAt && (
                <RateTimer expiresAt={rateExpiresAt} onExpire={() => setRate(null)} />
              )}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        {rate && (
          <Button onClick={handleProceed} className="w-full">
            Continue to Review
          </Button>
        )}
      </main>
    </div>
  )
}

