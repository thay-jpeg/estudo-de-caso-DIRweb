import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useDeclaracaoStore } from '@/store/useDeclaracaoStore'

export default function Toast() {
  const toast = useDeclaracaoStore((s) => s.toast)
  const clear = useDeclaracaoStore((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clear, 3500)
    return () => clearTimeout(t)
  }, [toast, clear])

  if (!toast) return null
  const ok = toast.type === 'success'
  return (
    <div role="status" className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {ok ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
      {toast.msg}
    </div>
  )
}
