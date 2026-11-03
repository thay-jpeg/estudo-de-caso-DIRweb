import { useState } from 'react'
import { declaracaoService } from '@/services/declaracaoService'
import { useDeclaracaoStore, validarDeclaracao } from '@/store/useDeclaracaoStore'

/** Ação única de envio (usada pelo botão do Início e pelo do Resumo). */
export function useEnviarDeclaracao() {
  const [enviando, setEnviando] = useState(false)

  const enviar = async () => {
    const s = useDeclaracaoStore.getState()
    const pendencias = validarDeclaracao(s)
    if (pendencias.length > 0) {
      window.alert('Não foi possível enviar a declaração:\n\n• ' + pendencias.join('\n• '))
      return
    }
    if (!window.confirm('Confirmar o envio da Declaração de Imposto de Renda 2026?')) return
    try {
      setEnviando(true)
      const { protocolo } = await declaracaoService.enviarDeclaracao()
      s.setEnviada(true)
      s.showToast(`Declaração enviada com sucesso! Protocolo ${protocolo}`)
    } catch {
      s.showToast('Erro ao enviar a declaração.', 'error')
    } finally {
      setEnviando(false)
    }
  }
  return { enviar, enviando }
}
