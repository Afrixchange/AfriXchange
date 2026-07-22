import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    const { error: resetError } = await resetPassword(email)
    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
        <div className="w-full max-w-md text-center">
          <div className="bg-surface-card p-8 rounded-xl shadow-sm border border-border-subtle">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">Check your email</h2>
            <p className="text-ink/60 mb-6">
              We've sent a password reset link to <span className="font-semibold text-ink">{email}</span>
            </p>
            <Link to="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-brand">AfriXchange</Link>
          <h2 className="text-2xl font-bold text-ink mt-6">Forgot password?</h2>
          <p className="text-ink/60 mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-xl shadow-sm border border-border-subtle space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-ink/60 mt-4">
            Remember your password?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

