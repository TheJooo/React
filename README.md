# CPF Lookup App (React + Node.js + MySQL)

Este é um sistema de consulta e gerenciamento de usuários via CPF, com autenticação de login para acesso à aplicação.

---

## 🧱 Tecnologias utilizadas

- React + Vite + TypeScript (Frontend)
- Node.js + Express (Backend)
- MySQL (Banco de Dados)
- Axios + React Router + React Query

---

## 🛠️ Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cpf-lookup.git
cd cpf-lookup
```

---

### 2. Configure o banco de dados

#### Acesse seu MySQL (ex: via MySQL Workbench ou terminal) e execute:

```sql
CREATE DATABASE IF NOT EXISTS cpf_lookup;
USE cpf_lookup;

CREATE TABLE users (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  anoNascimento INT NOT NULL,
  endereco VARCHAR(255),
  genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL
);

CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insere usuários de exemplo
INSERT INTO users (cpf, nome, anoNascimento, endereco, genero) VALUES
('12345678901', 'João Vitor', 1999, 'Rua das Palmeiras, 123 - São Paulo', 'Masculino'),
('98765432100', 'Maria Oliveira', 2002, 'Av. Brasil, 456 - Rio de Janeiro', 'Feminino');

-- Admin padrão para login
INSERT INTO admin (username, password) VALUES
('root', 'admin');
```

---

### 3. Backend (Node.js)

#### Vá para a pasta backend:
```bash
cd backend
```

#### Instale as dependências:
```bash
npm install
```

#### Configure o banco no `server.js`:
Edite as credenciais de conexão com seu banco de dados:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "seu_usuario_mysql",
  password: "sua_senha",
  database: "cpf_lookup"
});
```

#### Inicie o servidor:
```bash
npm run dev
```

> O backend estará rodando em: `http://localhost:5000`

---

### 4. Frontend (React + Vite)

#### Volte para a raiz do projeto:
```bash
cd ../cpf-lookup
```

#### Instale as dependências:
```bash
npm install
```

#### Inicie o app:
```bash
npm run dev
```

> A aplicação estará disponível em: `http://localhost:5173`

---

## 🔐 Login obrigatório

Antes de acessar as funcionalidades, é necessário fazer login na tela inicial com as credenciais:

- **Usuário:** `root`
- **Senha:** `admin`

---

## ✨ Funcionalidades

- 🔍 Buscar usuário por CPF
- 👤 Ver todos os usuários
- ➕ Criar novo usuário
- ✏️ Editar nome, endereço, gênero e ano de nascimento (CPF fixo)
- 🗑️ Excluir usuário
- 🕹️ Mini-jogo Pong integrado 😄

---

## 📌 Requisitos

- Node.js (v16+ recomendado)
- MySQL Server

