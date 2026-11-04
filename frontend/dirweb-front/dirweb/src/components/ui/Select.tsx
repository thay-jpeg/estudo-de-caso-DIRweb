import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string | number; label: string }[]
  placeholder?: string
  error?: string
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, placeholder = 'Selecione...', error, className = '', id, ...rest },
  ref,
) {
  const selectId = id ?? rest.name
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-medium text-brand">{label}</label>
      <select
        {...rest}
        id={selectId}
        ref={ref}
        defaultValue={rest.defaultValue ?? ''}
        aria-invalid={!!error}
        className={`h-10 rounded-lg border bg-neutral-100 px-3 text-sm text-neutral-800 outline-none transition focus:ring-2 focus:ring-brand/30 ${
          error ? 'border-red-500' : 'border-brand/50'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
})
export default Select
