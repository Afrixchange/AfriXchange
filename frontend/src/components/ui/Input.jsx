import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    error,
    type = 'text',
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          text-gray-900 placeholder-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          ${error ? 'border-danger focus:ring-danger' : 'border-gray-300 hover:border-gray-400'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  )
})

export default Input

