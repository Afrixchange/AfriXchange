import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, type = 'text', className = '', id, rightElement, ...props },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink/70 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full px-4 py-2.5 rounded-xl border text-ink placeholder-ink/40
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-border-subtle hover:border-brand/30'}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

export default Input
