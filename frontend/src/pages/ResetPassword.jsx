import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import BrandLogo from '../components/BrandLogo'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function PasswordEye({ visible, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/45 transition hover:bg-brand/5 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {visible ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
        )}
      </svg>
    </button>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <BrandLogo to="/" />
          <h1 className="text-2xl font-bold text-ink mt-8">Reset password</h1>
          <p className="text-ink/60 mt-2">Choose a new password for your AfriXchange account.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-2xl shadow-xl shadow-brand/10 border border-border-subtle space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="New password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <PasswordEye
                visible={showPassword}
                onToggle={() => setShowPassword(value => !value)}
                label={showPassword ? 'Hide password' : 'Show password'}
              />
            }
          />

          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightElement={
              <PasswordEye
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(value => !value)}
                label={showConfirmPassword ? 'Hide password' : 'Show password'}
              />
            }
          />

          <Button type="submit" loading={loading} className="w-full">
            Save New Password
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
