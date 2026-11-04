import { Check } from 'lucide-react'

export interface ChecklistItem { id: string; label: string; done: boolean }

export default function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((it) => (
        <li key={it.id} className="flex items-center gap-3 text-sm text-brand">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${it.done ? 'bg-brand text-white' : 'bg-brand-muted'}`}>
            {it.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
          {it.label}
        </li>
      ))}
    </ul>
  )
}
