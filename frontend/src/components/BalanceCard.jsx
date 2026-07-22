const CURRENCY_SYMBOLS = {
  NGN: '₦',
  USD: '$',
  USDT: '₮',
}

export default function BalanceCard({ wallet }) {
  const { currency, balance, name } = wallet
  const symbol = CURRENCY_SYMBOLS[currency] || ''

  return (
    <div className="flex items-center justify-between p-4 bg-surface-card rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-brand font-semibold">
          {symbol}
        </div>
        <div>
          <p className="font-poppins font-semibold text-ink">{name}</p>
          <p className="text-xs text-ink/40">{currency}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-poppins font-bold text-ink">
          {symbol}{parseFloat(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}