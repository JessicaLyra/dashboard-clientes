# Dashboard de Clientes

Sistema fullstack para gerenciamento de clientes e seus sites, com autenticação segura e dashboard administrativo.

Projeto desenvolvido com foco em boas práticas de frontend, backend e organização de código, simulando um sistema real de gestão utilizado por freelancers e agências.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Prisma ORM**
- **SQLite** (ambiente local)
- **bcrypt** (criptografia de senhas)
- **Autenticação com sessão**
- **Tailwind CSS**
- **Git & GitHub**

---

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Senhas criptografadas
- Sessão protegida
- Logout com remoção de sessão

### 👥 Clientes
- Cadastro de clientes
- Edição de dados
- Exclusão com confirmação
- Listagem em dashboard

### 🌐 Sites por Cliente
- Cadastro de sites vinculados a clientes
- Edição de site
- Exclusão de site
- Controle de status do site:
  - 🟢 Ativo
  - 🔴 Fora do ar
  - 🟡 Manutenção
- Exibição visual de status no dashboard

### 📊 Dashboard
- Visualização organizada por cliente
- Sites agrupados por cliente
- Interface limpa e intuitiva
- Fluxo similar a sistemas administrativos reais

---

## 🧠 Arquitetura

- API construída com **Next.js Route Handlers**
- Prisma como camada de acesso ao banco
- Separação clara entre:
  - Frontend
  - Backend
  - Regras de negócio
- Código preparado para expansão (roles, permissões, métricas, etc.)

---

## ▶️ Como rodar o projeto localmente

```bash
# Instalar dependências
npm install

# Rodar migrations do Prisma
npx prisma migrate dev

# Iniciar o servidor
npm run dev
