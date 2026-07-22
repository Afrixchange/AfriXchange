import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'

const STEPS = [
  {
    title: 'Welcome to AfriXchange! 🎉',
    body: 'Your secure gateway to cross-border financial exchange. Let\'s get you set up in just a few steps.',
    icon: '👋',
  },
  {
    title: 'Verify Your Identity',
    body: 'To comply with regulations and protect your account, we need to verify who you are. This takes just a few minutes.',
    icon: '🛡️',
  },
  {
    title: 'Set Up Your Wallet',
    body: 'Once verified, your multi-currency wallet will be ready. Hold NGN, USD, and USDT in one place.',
    icon: '💼',
  },
  {
    title: 'Start Transacting',
    body: 'Deposit funds, convert currencies, and withdraw — all with competitive rates and real-time tracking.',
    icon: '🚀',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [step, setStep] = useState(0)

  const isLast = step === STEPS.length - 1

  function handleNext() {
    if (isLast) {
      // If KYC not started, redirect there; otherwise go to home
      if (!profile || profile.kyc_status === 'not_started') {
        navigate('/kyc/start')
      } else {
        navigate('/home')
      }
    } else {
      setStep(s => s + 1)
    }
  }

  function handleSkip() {
    navigate('/home')
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top progress bar */}
      <div className="w-full bg-surface-card border-b border-border-subtle px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? 'bg-brand' : 'bg-border-subtle'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">{current.icon}</div>
          <h1 className="text-3xl font-bold text-ink mb-4 font-poppins">
            {current.title}
          </h1>
          <p className="text-lg text-ink/60 leading-relaxed">
            {current.body}
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="max-w-md mx-auto w-full px-6 pb-10 space-y-3">
        <Button onClick={handleNext} className="w-full" size="lg">
          {isLast ? 'Get Started' : 'Continue'}
        </Button>
        {!isLast && (
          <button
            onClick={handleSkip}
            className="w-full text-center text-sm text-ink/40 hover:text-ink transition-colors py-2"
          >
            Skip onboarding
          </button>
        )}
      </div>
    </div>
  )
}

