# DIRweb – Front-end (IRPF 2026)

React + TypeScript + Vite + Tailwind CSS · React Router · Zustand · Axios · React Hook Form + Zod.

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL
npm run dev
```

Estrutura: `src/components/{layout,ui}`, `src/pages`, `src/services`, `src/store`, `src/types`, `src/routes`.
Protótipos e enunciados em `docs/` e `src/assets/`.

## Autenticação (mock estilo Gov.br)
Rota `/login` (steps: CPF → senha | cadastro; "Esqueci minha senha" → código → nova senha). Após o login: `/home`.
- Usuário de teste: **CPF 123.456.789-09 / senha `Senha@123`** (declaração com dados fictícios)
- Código de recuperação (e-mail simulado): **123456**
- Qualquer outro CPF válido cai no cadastro (perfilAcesso fixo `contribuinte`) e inicia com declaração vazia.

## Painel do Auditor Fiscal (mock)
- Login do auditor: **CPF 999.999.999-99 / senha `Auditor@123`** → `/auditor`
- Contribuintes do mock (senha `Senha@123`): 529.982.247-25 (Enviada), 111.444.777-35 (Processada), 390.533.447-05 (Retida), 168.995.350-09 (Enviada)
- Telas: Triagem (`/auditor`), Auditoria (`/auditor/declaracoes/:id`), Gestão de Acessos (`/auditor/acessos`)
- Alerta patrimonial: bens (31/12/2026) > 2× rendimentos anuais (Carlos e Ana disparam o alerta)
- Para testar o cadastro de novo contribuinte use um CPF válido inexistente no mock, ex.: **453.178.287-91**
