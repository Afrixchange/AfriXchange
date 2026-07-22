import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function SelfieCapture() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit() {
    if (!selectedFile) return
    setUploading(true)
    // TODO: Submit via kyc-submit Edge Function in Phase 2
    setTimeout(() => {
      setUploading(false)
      navigate('/kyc/pending')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/kyc/id-capture" className="text-ink/60 hover:text-ink">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-ink">Take a Selfie</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle text-center space-y-4">
          {/* Capture Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-subtle rounded-xl p-8 cursor-pointer hover:border-brand transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Selfie preview" className="max-h-48 mx-auto rounded-xl" />
            ) : (
              <div>
                <svg className="w-12 h-12 text-ink/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-ink/60">Tap to take a selfie</p>
                <p className="text-xs text-ink/40 mt-1">Ensure your face is clearly visible</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <p className="text-xs text-ink/40">
            Your photo will only be used for identity verification purposes.
          </p>

          <Button
            variant="primary"
            className="w-full"
            disabled={!selectedFile}
            loading={uploading}
            onClick={handleSubmit}
          >
            Submit for Verification
          </Button>
        </div>
      </main>
    </div>
  )
}
