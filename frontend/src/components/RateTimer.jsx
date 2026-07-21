import { useState, useEffect } from 'react'

export default function RateTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    function updateTime() {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
      setTimeLeft(diff)

      if (diff <= 0 && onExpire) {
        onExpire()
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isExpiring = timeLeft <= 10

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${isExpiring ? 'text-danger' : 'text-warning'}`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

