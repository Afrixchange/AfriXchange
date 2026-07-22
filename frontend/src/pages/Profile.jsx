/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'

const KYC_BADGE = {
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-ink/70' },
  pending: { label: 'Pending', color: 'bg-amber-400/10 text-amber-500' },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-500' },
}

export default function Profile() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState(null)

  const badge = KYC_BADGE[profile?.kyc_status] || KYC_BADGE.not_started
  const avatarLetter = profile?.full_name?.charAt(0)?.toUpperCase() || 'U'
  const displayName = profile?.full_name || 'User'
  const displayUsername = profile?.username ? `@${profile.username}` : null

  async function handleSignOut() {
    setSignOutError(null)
    setSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      setSignOutError('Could not sign out. Please try again.')
      setSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-ink/60 hover:text-ink" aria-label="Back to home">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-ink">Profile</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* User Info Card */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle">
          <div className="flex items-center gap-4 mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand/20"
              />
            ) : (
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-2xl font-bold text-brand">{avatarLetter}</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-ink">{displayName}</h2>
              {displayUsername && (
                <p className="text-sm text-ink/50">{displayUsername}</p>
              )}
              <p className="text-sm text-ink/60">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-ink/60">KYC Status:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle space-y-3">
          <h3 className="font-semibold text-ink mb-2">Account Details</h3>
          {profile?.username && (
            <div className="flex justify-between text-sm">
              <span className="text-ink/60">Username</span>
              <span className="text-ink">@{profile.username}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">Email</span>
            <span className="text-ink">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">Phone</span>
            <span className="text-ink">{profile?.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink/60">KYC Tier</span>
            <span className="text-ink">{profile?.kyc_tier ?? 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link to="/profile/edit">
            <Button variant="ghost" className="w-full justify-start">Edit Profile</Button>
          </Link>
          <Link to="/help">
            <Button variant="ghost" className="w-full justify-start">Help & Support</Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </Button>
          {signOutError && (
            <p className="text-xs text-red-500 px-1" role="alert">{signOutError}</p>
          )}
        </div>
      </main>
    </div>
  )
}
