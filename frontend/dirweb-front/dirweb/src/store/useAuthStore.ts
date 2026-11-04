import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SessaoUsuario } from '@/types'

interface AuthState {
  token: string | null
  usuario: SessaoUsuario | null
  login: (token: string, usuario: SessaoUsuario) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      login: (token, usuario) => set({ token, usuario }),
      logout: () => set({ token: null, usuario: null }),
    }),
    { name: 'dirweb-auth', storage: createJSONStorage(() => sessionStorage) },
  ),
)
