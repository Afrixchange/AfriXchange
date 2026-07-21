import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function KycStart() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark">Verify Your Identity</h2>
          <p className="text-gray-500 mt-2">
            To comply with regulations and keep your account secure, we need to verify your identity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-dark">Personal Information</h3>
                <p className="text-sm text-gray-500">Provide your NIN or BVN for verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-dark">ID Document</h3>
                <p className="text-sm text-gray-500">Upload a clear photo of your government-issued ID</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-dark">Selfie</h3>
                <p className="text-sm text-gray-500">Take a selfie for liveness verification</p>
              </div>
            </div>
          </div>

          <Link to="/kyc/id-capture" className="block">
            <Button variant="primary" className="w-full">Start Verification</Button>
          </Link>

          <Link to="/home" className="block text-center text-sm text-gray-500 hover:text-dark">
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  )
}

