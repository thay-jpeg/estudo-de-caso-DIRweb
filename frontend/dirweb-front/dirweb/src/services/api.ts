import axios from 'axios'

/** Instância Axios para a API REST Java (Spring Boot, N-Camadas). */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ?? error.message ?? 'Erro ao comunicar com o servidor'
    return Promise.reject(new Error(message))
  },
)
