import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  variant?: 'action' | 'primary' | 'ghost'
}

const variants = {
  action: 'bg-brand-action text-white hover:brightness-110',
  primary: 'bg-brand text-white hover:brightness-110',
  ghost: 'bg-brand-soft text-brand hover:bg-[#e4e9fb]',
}

export default function Button({ icon, variant = 'primary', className = '', children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}
