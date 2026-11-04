import { useState } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import StepCpf from '@/components/auth/StepCpf'
import StepSenha from '@/components/auth/StepSenha'
import StepRecuperacao from '@/components/auth/StepRecuperacao'
import StepCadastro from '@/components/auth/StepCadastro'
import ilustracaoGovBr from '@/assets/govbr-ilustracao.png'
import ilustracaoSenha from '@/assets/govbr-senha.png'

type Step = 'cpf' | 'senha' | 'recuperar' | 'cadastro'

/** Rota /login: renderização condicional dos steps A (cpf), B (senha), C (recuperar) e D (cadastro). */
export default function Login() {
  const [step, setStep] = useState<Step>('cpf')
  const [cpf, setCpf] = useState('')

  const comSenha = step === 'senha' || step === 'recuperar'

  return (
    <AuthLayout
      ilustracao={comSenha ? ilustracaoSenha : ilustracaoGovBr}
      ilustracaoAlt={comSenha ? 'Digite sua senha para acessar serviços públicos digitais' : 'Uma conta gov.br garante a identificação de cada cidadão'}
    >
      {step === 'cpf' && (
        <StepCpf initialCpf={cpf} onResult={(c, existe) => { setCpf(c); setStep(existe ? 'senha' : 'cadastro') }} />
      )}
      {step === 'senha' && <StepSenha cpf={cpf} onCancel={() => setStep('cpf')} onForgot={() => setStep('recuperar')} />}
      {step === 'recuperar' && <StepRecuperacao cpf={cpf} onCancel={() => setStep('senha')} onDone={() => setStep('cpf')} />}
      {step === 'cadastro' && <StepCadastro cpf={cpf} onCancel={() => setStep('cpf')} />}
    </AuthLayout>
  )
}
