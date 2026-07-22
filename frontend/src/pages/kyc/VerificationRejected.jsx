import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function VerificationRejected() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-card p-8 rounded-xl border border-border-subtle shadow-sm">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-2">Verification Rejected</h2>
          <p className="text-ink/60 mb-2">
            Unfortunately, we couldn't verify your identity with the provided documents.
          </p>
          <p className="text-sm text-ink/40 mb-6">
            Common reasons: unclear photos, mismatched information, or expired documents.
            Please try again with clearer images and accurate information.
          </p>

          <div className="space-y-3">
            <Link to="/kyc/id-capture">
              <Button variant="primary" className="w-full">Try Again</Button>
            </Link>
            <Link to="/help">
              <Button variant="ghost" className="w-full">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

