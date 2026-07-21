import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
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
      formData.phone
    )
    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    // Navigate to OTP verification
    navigate('/verify-otp', { state: { email: formData.email } })
  }

  function handleChange(field) {
    return (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">AfriXchange</Link>
          <h2 className="text-2xl font-bold text-dark mt-6">Create your account</h2>
          <p className="text-gray-500 mt-2">Start exchanging across borders</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
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
            type="password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

