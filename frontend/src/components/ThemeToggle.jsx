import { useTheme } from '../theme/ThemeProvider'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-ink/70 shadow-sm transition hover:border-brand/30 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {isDark ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36l-1.42 1.42M7.06 16.94l-1.42 1.42m12.72 0l-1.42-1.42M7.06 7.06L5.64 5.64M12 8a4 4 0 100 8 4 4 0 000-8z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.5 14.5A8.5 8.5 0 119.5 3.5 6.7 6.7 0 0020.5 14.5z" />
        )}
      </svg>
    </button>
  )
}
