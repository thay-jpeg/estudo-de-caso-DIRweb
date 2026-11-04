import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'filled' | 'outline' }

/** Botão pílula padrão Gov.br (azul preenchido ou contorno). */
export default function GovButton({ variant = 'filled', className = '', type = 'button', children, ...rest }: Props) {
  const style =
    variant === 'filled'
      ? 'bg-brand-action text-white hover:brightness-110'
      : 'border border-brand-action bg-brand-soft text-brand-action hover:bg-[#e4e9fb]'
  return (
    <button type={type} {...rest}
      className={`h-11 rounded-full px-9 text-base font-bold shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 ${style} ${className}`}>
      {children}
    </button>
  )
}
