import { Link } from 'react-router-dom'

const faqs = [
  {
    q: 'How do I deposit funds?',
    a: 'Go to Home, tap "Deposit", select your currency, enter the amount, and follow the payment instructions. We currently support Paystack for NGN deposits.'
  },
  {
    q: 'How long does KYC verification take?',
    a: 'Most verifications are completed within a few minutes. In some cases, it may take up to 24 hours for manual review.'
  },
  {
    q: 'What currencies can I hold?',
    a: 'You can hold Naira (NGN), US Dollars (USD), and Tether (USDT) in your AfriXchange wallets.'
  },
  {
    q: 'How do withdrawals work?',
    a: 'Navigate to the Withdraw screen, select your currency and amount, enter your transaction PIN, and confirm. Withdrawals are processed through our banking partners.'
  },
  {
    q: 'What is a transaction PIN?',
    a: 'Your transaction PIN is a 4-digit security code used to authorize withdrawals and currency conversions. You can set or change it in your Profile settings.'
  },
  {
    q: 'Why was my transaction held?',
    a: 'Some transactions are flagged for compliance review based on amount thresholds or unusual patterns. Our team reviews these and updates the status promptly.'
  }
]

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">Help & Support</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Contact Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-dark mb-2">Need help?</h2>
          <p className="text-sm text-gray-500 mb-4">
            Our support team is available to assist you.
          </p>
          <a
            href="mailto:support@afrixchange.com"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@afrixchange.com
          </a>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-dark">Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-gray-200 group">
              <summary className="p-4 cursor-pointer list-none flex items-center justify-between">
                <span className="font-medium text-dark text-sm">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </main>
    </div>
  )
}

