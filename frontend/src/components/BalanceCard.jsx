export default function BalanceCard({ wallet }) {
  const { currency, balance, flag, name } = wallet

  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    USDT: '₮'
  }

  const symbol = currencySymbols[currency] || ''

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-lg">
          {flag}
        </div>
        <div>
          <p className="font-semibold text-dark">{name}</p>
          <p className="text-xs text-gray-400">{currency}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-dark">
          {symbol}{parseFloat(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}

