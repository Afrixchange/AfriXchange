const variants = {
  primary: 'bg-accent text-brand-dark hover:bg-accent-dark hover:text-white focus:outline-accent',
  secondary: 'bg-surface text-ink hover:bg-brand/5 focus:outline-brand',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:outline-red-500',
  ghost: 'bg-transparent text-ink/70 hover:bg-brand/5 hover:text-brand focus:outline-brand',
  outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white focus:outline-brand'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-colors duration-150
        focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
