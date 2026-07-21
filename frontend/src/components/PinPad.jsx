import { useState } from 'react'
import Input from './ui/Input'

export default function PinPad({ onConfirm, error }) {
  const [pin, setPin] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (onConfirm && pin.length >= 4) {
      onConfirm(pin)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Transaction PIN"
        type="password"
        placeholder="Enter your 4-digit PIN"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
      />
    </form>
  )
}

