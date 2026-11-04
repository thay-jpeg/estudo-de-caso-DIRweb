import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  footer?: ReactNode
  onRowClick?: (row: T) => void
}

export default function DataGrid<T>({ columns, rows, rowKey, loading, emptyMessage = 'Nenhum registro cadastrado.', footer, onRowClick }: Props<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand/20 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-brand">
          <thead className="bg-brand-card">
            <tr>
              {columns.map((c) => (
                <th key={c.header} className={`whitespace-nowrap px-4 py-2.5 font-bold ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center opacity-70">Carregando...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center opacity-70">{emptyMessage}</td></tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  className={`border-t border-brand/10 even:bg-brand-soft/60 ${onRowClick ? 'cursor-pointer transition-colors hover:bg-brand-card focus:bg-brand-card focus:outline-none' : ''}`}
                >
                  {columns.map((c) => (
                    <td key={c.header} className={`whitespace-nowrap px-4 py-2.5 ${c.align === 'right' ? 'text-right' : ''}`}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && <div className="border-t border-brand/20 bg-brand-soft px-4 py-2.5 text-sm font-bold text-brand">{footer}</div>}
    </div>
  )
}
