import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import BrandLogo from '../components/BrandLogo'
import ThemeToggle from '../components/ThemeToggle'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function validate() {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) newErrors.username = 'Username must be 3-20 chars, letters, numbers, underscore'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      formData.phone,
      formData.username
    )
    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    // Navigate to onboarding
    navigate('/onboarding')
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  function handleChange(field) {
    return (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr] bg-surface">
      <section className="hidden lg:flex flex-col justify-between bg-brand p-10 text-white">
        <BrandLogo to="/" className="[&_*]:text-white [&_img]:shadow-none" />
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Create your wallet</p>
          <h1 className="max-w-md font-poppins text-5xl font-bold leading-tight">
            A cleaner way to hold, convert, and withdraw.
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {['NGN', 'USD', 'USDT'].map(currency => (
            <div key={currency} className="rounded-2xl bg-white/10 p-4 font-semibold">{currency}</div>
          ))}
        </div>
      </section>

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
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
            <h2 className="text-2xl font-bold text-ink mt-8">Create your account</h2>
            <p className="text-ink/60 mt-2">Start exchanging across borders</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card p-6 md:p-8 rounded-2xl shadow-xl shadow-brand/10 border border-border-subtle space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
          />

          <Input
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange('username')}
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
          />

          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+234 800 000 0000"
            value={formData.phone}
            onChange={handleChange('phone')}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
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

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(value => !value)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/45 transition hover:bg-brand/5 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A9.7 9.7 0 0112 5c6 0 9.5 7 9.5 7a15.4 15.4 0 01-3.2 4.1M6.3 6.4A15.6 15.6 0 002.5 12S6 19 12 19c1.3 0 2.5-.3 3.6-.8" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  )}
                </svg>
              </button>
            }
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>

          <p className="text-center text-sm text-ink/60 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </form>
        </div>
      </main>
    </div>
  )
}

