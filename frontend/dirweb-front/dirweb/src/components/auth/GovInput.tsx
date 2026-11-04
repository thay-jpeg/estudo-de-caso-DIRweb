import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  mask?: (v: string) => string
  icon?: ReactNode
}

/** Input estilo Gov.br: label em negrito, borda escura, placeholder em itálico; type="password" ganha o botão de olho. */
const GovInput = forwardRef<HTMLInputElement, Props>(function GovInput(
  { label, error, mask, icon, type = 'text', onChange, id, className = '', ...rest }, ref,
) {
  const [visivel, setVisivel] = useState(false)
  const isPwd = type === 'password'
  const inputId = id ?? rest.name
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-base font-semibold text-black">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>}
        <input
          {...rest}
          id={inputId}
          ref={ref}
          type={isPwd && visivel ? 'text' : type}
          aria-invalid={!!error}
          onChange={(e) => { if (mask) e.target.value = mask(e.target.value); onChange?.(e) }}
          className={`h-12 w-full rounded-md border bg-white text-base text-neutral-900 outline-none transition placeholder:italic placeholder:text-neutral-500 focus:ring-2 focus:ring-brand-action/30 read-only:bg-neutral-100 read-only:text-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-500 ${
            icon ? 'pl-11' : 'pl-4'
          } ${isPwd ? 'pr-12' : 'pr-4'} ${error ? 'border-red-500' : 'border-neutral-500'}`}
        />
        {isPwd && (
          <button type="button" aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisivel((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-brand">
            {visivel ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
})
export default GovInput
