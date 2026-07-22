import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function IdCapture() {
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

  function handleContinue() {
    if (!selectedFile) return
    setUploading(true)
    // TODO: Upload to Supabase storage via Edge Function in Phase 2
    setTimeout(() => {
      setUploading(false)
      navigate('/kyc/selfie-capture')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-card border-b border-border-subtle px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/kyc/start" className="text-ink/60 hover:text-ink">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-ink">Upload ID Document</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-surface-card p-6 rounded-xl border border-border-subtle text-center space-y-4">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border-subtle rounded-xl p-8 cursor-pointer hover:border-brand transition-colors"
          >
            {preview ? (
              <img src={preview} alt="ID preview" className="max-h-48 mx-auto rounded-xl" />
            ) : (
              <div>
                <svg className="w-12 h-12 text-ink/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-ink/60">Tap to upload your ID</p>
                <p className="text-xs text-ink/40 mt-1">Passport, Driver's License, or National ID</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <Button
            variant="primary"
            className="w-full"
            disabled={!selectedFile}
            loading={uploading}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  )
}

