import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  mask?: (v: string) => string
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, mask, className = '', onChange, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-brand">{label}</label>
      <input
        {...rest}
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        onChange={(e) => {
          if (mask) e.target.value = mask(e.target.value)
          onChange?.(e)
        }}
        className={`h-10 rounded-lg border bg-neutral-100 px-3 text-sm text-neutral-800 outline-none transition focus:ring-2 focus:ring-brand/30 ${
          error ? 'border-red-500' : 'border-brand/50'
        }`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
})
export default Input
