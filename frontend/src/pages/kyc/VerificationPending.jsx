import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function VerificationPending() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          {/* Clock Icon */}
          <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-dark mb-2">Verification in Progress</h2>
          <p className="text-gray-500 mb-6">
            Your identity documents are being reviewed. This usually takes a few minutes.
            We'll notify you once the verification is complete.
          </p>

          <Link to="/home">
            <Button variant="primary" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

