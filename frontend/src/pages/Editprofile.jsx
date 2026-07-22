/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'

export default function EditProfile() {
  const { profile, updateProfile, uploadAvatar } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const trimmedName = fullName.trim()
  const trimmedUsername = username.trim()
  const isValid = trimmedName.length > 0
  const isDirty =
    trimmedName !== (profile?.full_name || '') ||
    trimmedUsername !== (profile?.username || '') ||
    phone.trim() !== (profile?.phone || '') ||
    avatarFile !== null

  function handleAvatarSelect(e) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB')
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid || saving) return

    setError(null)
    setSaving(true)
    try {
      // Upload avatar first if selected
      if (avatarFile) {
        await uploadAvatar(avatarFile)
      }

      // Update profile fields
      await updateProfile({
        full_name: trimmedName,
        username: trimmedUsername || null,
        phone: phone.trim() || null,
      })

      navigate('/profile', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not save changes. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/profile" className="text-ink/60 hover:text-ink" aria-label="Back to profile">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-ink">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
            >
              {avatarPreview || profile?.avatar_url ? (
                <img
                  src={avatarPreview || profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="text-3xl font-bold text-brand">
                    {trimmedName.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-brand font-medium hover:underline"
            >
              {profile?.avatar_url ? 'Change photo' : 'Upload photo'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="full_name" className="text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              maxLength={100}
              required
              className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-ink">
              Username
            </label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-ink/40">@</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20))}
                placeholder="username"
                maxLength={20}
                className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-ink">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08012345678"
              maxLength={20}
              className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500" role="alert">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Link to="/profile" className="flex-1">
              <Button type="button" variant="ghost" className="w-full justify-center">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 justify-center"
              disabled={!isValid || !isDirty || saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

