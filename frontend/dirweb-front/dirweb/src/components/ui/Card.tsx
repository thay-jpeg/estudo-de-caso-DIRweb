import type { ReactNode } from 'react'

interface CardProps { title?: string; icon?: ReactNode; children: ReactNode; className?: string }

export default function Card({ title, icon, children, className = '' }: CardProps) {
  return (
    <section className={`overflow-hidden rounded-xl bg-brand-soft ${className}`}>
      {title && (
        <header className="flex items-center gap-2.5 bg-brand-card px-5 py-2.5 text-sm font-bold text-brand">
          {icon}
          <h2>{title}</h2>
        </header>
      )}
      {children}
    </section>
  )
}
