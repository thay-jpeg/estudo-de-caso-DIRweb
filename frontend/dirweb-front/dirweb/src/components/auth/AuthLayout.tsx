import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Toast from '@/components/ui/Toast'

interface Props { ilustracao: string; ilustracaoAlt: string; children: ReactNode }

/** Duas colunas: ilustração à esquerda; card de ação à direita com a MESMA altura da imagem (28rem, cresce se o conteúdo exigir). */
export default function AuthLayout({ ilustracao, ilustracaoAlt, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="grid flex-1 grid-cols-1 content-center items-stretch gap-10 px-6 py-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-[6%]">
        <div className="hidden items-center justify-center lg:flex">
          <img src={ilustracao} alt={ilustracaoAlt} className="h-[28rem] w-full object-contain" />
        </div>
        <section
          className="flex min-h-[28rem] w-full flex-col justify-center rounded-lg bg-white p-8 lg:p-10"
          style={{
            boxShadow:
              '10px 14px 30px rgba(26,63,134,.20), 4px 6px 12px rgba(26,63,134,.10), -6px -6px 22px rgba(175,210,251,.45)',
          }}
        >
          {children}
        </section>
      </main>
      <Toast />
    </div>
  )
}
