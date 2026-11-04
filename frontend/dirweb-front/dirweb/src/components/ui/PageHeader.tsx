import type { ReactNode } from 'react'

export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-brand">{title}</h1>
        {subtitle && <p className="text-sm text-brand/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
