const fs = require('fs');
const path = require('path');

const walletCardFunction = `function WalletCard({ wallet, showBalance }) {
  const meta = WALLET_META[wallet.currency]
  return (
    <div className="bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center text-brand font-semibold">
            {meta.glyph}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{meta.label}</p>
            <p className="text-xs text-ink/50">{wallet.currency} Wallet</p>
          </div>
      </div>
      <p className="text-xs text-ink/50 mb-1">Available balance</p>
      <p className="font-poppins font-semibold text-2xl text-ink mb-5">
        {showBalance
          ? \`\${meta.glyph}\${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}\`
          : '\u2022\u2022\u2022\u2022\u2022\u2022'}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <Link to={\`/deposit?currency=\${wallet.currency}\`} className="text-center text-xs font-medium text-brand bg-surface rounded-xl py-2.5 hover:bg-brand hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Deposit</Link>
        <Link to={\`/withdraw?currency=\${wallet.currency}\`} className="text-center text-xs font-medium text-brand bg-surface rounded-xl py-2.5 hover:bg-brand hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Withdraw</Link>
        <Link to={\`/convert?from=\${wallet.currency}\`} className="text-center text-xs font-medium text-brand bg-surface rounded-xl py-2.5 hover:bg-brand hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Convert</Link>
      </div>
  )
}`;

const content = `import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/nav/Sidebar'
import BottomNav from '../components/nav/BottomNav'

const WALLET_META = {
  NGN: { label: 'Naira', glyph: '\\u20A6' },
  USD: { label: 'US Dollar', glyph: '$' },
  USDT: { label: 'Tether', glyph: '\\u20AE' },
}

function BalanceToggle({ show, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={show ? 'Hide balances' : 'Show balances'}
      className="flex items-center gap-1.5 text-xs font-medium text-ink/50 hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {show ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
        )}
      </svg>
      {show ? 'Hide balances' : 'Show balances'}
    </button>
  )
}

${walletCardFunction}

export default function Wallets() {
  const [showBalance, setShowBalance] = useState(true)
  const wallets = [
    { currency: 'NGN', balance: 0 },
    { currency: 'USD', balance: 0 },
    { currency: 'USDT', balance: 0 },
  ]

  return (
    <div className="min-h-screen bg-surface md:flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <header className="px-4 md:px-8 pt-6 pb-4 flex items-center justify-between">
          <h1 className="font-poppins font-semibold text-xl md:text-2xl text-ink">Your Wallets</h1>
          <BalanceToggle show={showBalance} onToggle={() => setShowBalance(v => !v)} />
        </header>
        <main className="max-w-lg md:max-w-none mx-auto md:mx-0 px-4 md:px-8 pb-24 md:pb-8 space-y-6">
          <section className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-5">
            <p className="text-white/60 text-sm mb-1">Wallets</p>
            <p className="text-white font-poppins font-semibold text-2xl">
              {wallets.length} active currenc{wallets.length === 1 ? 'y' : 'ies'}
            </p>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wallets.map(wallet => (
              <WalletCard key={wallet.currency} wallet={wallet} showBalance={showBalance} />
            ))}
            <Link to="/wallets/add" className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border-subtle py-8 text-ink/40 hover:text-brand hover:border-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Add a currency</span>
            </Link>
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
`;

const targetPath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'Wallets.jsx');
fs.writeFileSync(targetPath, content.trim() + '\n', 'utf8');
console.log('Wallets.jsx written successfully');
