interface Props<T extends string> { tabs: { id: T; label: string }[]; active: T; onChange: (id: T) => void }

export default function Tabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-brand/20">
      {tabs.map((t) => (
        <button key={t.id} role="tab" type="button" aria-selected={active === t.id} onClick={() => onChange(t.id)}
          className={`-mb-px rounded-t-lg border border-b-0 px-5 py-2.5 text-sm font-bold transition-colors ${
            active === t.id ? 'border-brand/20 bg-brand text-white' : 'border-transparent text-brand hover:bg-brand-soft'
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
