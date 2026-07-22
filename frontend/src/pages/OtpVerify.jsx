import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function OtpVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyOtp, sendOtp } = useAuth()
  const email = location.state?.email || ''
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!token.trim() || token.length < 6) {
      setError('Please enter the full verification code')
      return
    }

    setLoading(true)
    setError('')
    const { error: verifyError } = await verifyOtp(email, token)
    setLoading(false)

    if (verifyError) {
      setError(verifyError.message)
      return
    }

    navigate('/home')
  }

  async function handleResend() {
    if (!email) return
    setResending(true)
    await sendOtp(email)
    setResending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-brand">AfriXchange</Link>
          <h2 className="text-2xl font-bold text-ink mt-6">Verify your email</h2>
          <p className="text-ink/60 mt-2">
            We sent a verification code to<br />
            <span className="font-semibold text-ink">{email || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-xl shadow-sm border border-border-subtle space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />

          <Button type="submit" loading={loading} className="w-full">
            Verify Email
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-brand hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

