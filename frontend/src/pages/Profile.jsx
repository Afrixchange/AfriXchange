import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user, profile, signOut } = useAuth()

  const kycBadge = {
    not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-600' },
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning' },
    approved: { label: 'Approved', color: 'bg-success/10 text-success' },
    rejected: { label: 'Rejected', color: 'bg-danger/10 text-danger' }
  }

  const badge = kycBadge[profile?.kyc_status] || kycBadge.not_started

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/home" className="text-gray-500 hover:text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-dark">Profile</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark">
                {profile?.full_name || 'User'}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">KYC Status:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
          <h3 className="font-semibold text-dark mb-2">Account Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="text-dark">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phone</span>
            <span className="text-dark">{profile?.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">KYC Tier</span>
            <span className="text-dark">{profile?.kyc_tier || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link to="/help">
            <Button variant="ghost" className="w-full justify-start">Help & Support</Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-danger"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  )
}

