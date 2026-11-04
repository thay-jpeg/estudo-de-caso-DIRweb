interface Props { percent: number; size?: number; stroke?: number }

export default function ProgressDonut({ percent, size = 117, stroke = 11 }: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(Math.max(percent, 0), 100) / 100) * c
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${percent}% concluído`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#c3cce3" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a3f86" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-brand">{percent}%</span>
    </div>
  )
}
