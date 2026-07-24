import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/home')
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen grid md:grid-cols-[0.95fr_1.05fr] bg-surface">
      <section className="hidden md:flex flex-col justify-between bg-brand p-10 text-white">
        <BrandLogo to="/" className="[&_*]:text-white [&_img]:shadow-none" />
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Welcome back</p>
          <h1 className="max-w-md font-poppins text-5xl font-bold leading-tight">
            Move money with a clearer view of every wallet.
          </h1>
        </div>
        <p className="text-sm text-white/60">AfriXchange keeps your NGN, USD, and USDT activity in one place.</p>
      </section>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-ink/70 shadow-sm transition hover:border-brand/30 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <BrandLogo to="/" />
              <ThemeToggle className="ml-auto" />
            </div>
            <h2 className="text-2xl font-bold text-ink mt-8">Welcome back</h2>
            <p className="text-ink/60 mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-2xl shadow-xl shadow-brand/10 border border-border-subtle space-y-4">
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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/45 transition hover:bg-brand/5 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  )}
                </svg>
              </button>
            }
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-brand hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>

          <p className="text-center text-sm text-ink/60 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
        </div>
      </main>
    </div>
  )
}

