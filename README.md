# ✅ API de Tarefas com JWT

API RESTful para gerenciamento de tarefas pessoais com autenticação via **JSON Web Token (JWT)**. Cada usuário pode criar e deletar apenas suas próprias tarefas, com senhas armazenadas de forma segura usando **bcrypt**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express.js** v5
- **PostgreSQL** (via driver `pg`)
- **JSON Web Token** (`jsonwebtoken`) — autenticação stateless
- **bcryptjs** — hashing de senhas
- **dotenv** — gerenciamento de variáveis de ambiente
- **ES Modules** (import/export nativo)

---

## 📁 Estrutura do Projeto
```
api_tarefas_jwt/
├── src/
│   ├── controller/
│   │   ├── tasks.controller.js       # Lógica das requisições de tarefas
│   │   └── users.controller.js       # Lógica das requisições de usuários
│   ├── database/
│   │   ├── db.js                     # Conexão com o banco e criação automática das tabelas
│   │   └── schema.sql                # Schema SQL de referência
│   ├── middlewares/
│   │   └── authJwtMiddleware.js      # Validação do token JWT nas rotas protegidas
│   ├── model/
│   │   ├── tasks.model.js            # Queries de tarefas no banco
│   │   └── users.model.js            # Queries de usuários no banco
│   ├── routes/
│   │   ├── tasks.routes.js           # Definição das rotas de tarefas
│   │   └── users.routes.js           # Definição das rotas de usuários
│   ├── utils/
│   │   └── jwtGenerator.js           # Gerador de tokens JWT
│   └── app.js                        # Entrada da aplicação
├── .env                              # Variáveis de ambiente (não versionado)
├── .gitignore
└── package.json
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Instância PostgreSQL disponível (local ou em nuvem, ex: [Supabase](https://supabase.com))

### Passos

1. Clone o repositório:
```bash
   git clone https://github.com/frassa09/api_tarefas_jwt.git
   cd api_tarefas_jwt
```

2. Instale as dependências:
```bash
   npm install
```

3. Crie o arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
   APP_PORT=3000

   DB_USER=seu_usuario
   DB_HOST=seu_host
   DB_DATABASE=nome_do_banco
   DB_PORT=5432
   DB_PASSWORD=sua_senha

   JWT_SECRET=sua_chave_secreta_jwt
   JWT_EXPIRESIN=1d

   SALT_ROUNDS=10
```

4. Inicie o servidor em modo de desenvolvimento:
```bash
   npm run dev
```

5. A API estará disponível em:
```
   http://localhost:3000
```

> **Nota:** As tabelas `users` e `tasks` são criadas automaticamente no banco ao iniciar o servidor, caso ainda não existam.

---

## 🗃️ Banco de Dados

### Schema
```sql
CREATE TABLE IF NOT EXISTS USERS (
    ID            SERIAL PRIMARY KEY,
    USERNAME      TEXT NOT NULL,
    EMAIL         TEXT UNIQUE NOT NULL,
    USER_PASSWORD TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TASKS (
    ID               SERIAL PRIMARY KEY,
    TITLE            TEXT NOT NULL,
    TASK_DESCRIPTION TEXT NOT NULL,
    COMPLETED        BOOLEAN,
    USER_ID          INT NOT NULL REFERENCES USERS(ID)
);
```

> A tabela `tasks` possui uma **chave estrangeira** (`USER_ID`) referenciando `users`, garantindo que toda tarefa pertença a um usuário cadastrado.

---

## 📦 Modelos de Dados

### 👤 User

| Campo           | Tipo    | Restrições          | Descrição                          |
|-----------------|---------|---------------------|------------------------------------|
| `id`            | Number  | PK, auto-incremento | Identificador único                |
| `username`      | String  | NOT NULL            | Nome do usuário                    |
| `email`         | String  | NOT NULL, UNIQUE    | E-mail — usado para login          |
| `user_password` | String  | NOT NULL            | Senha armazenada com hash bcrypt   |

### ✅ Task

| Campo              | Tipo    | Restrições          | Descrição                              |
|--------------------|---------|---------------------|----------------------------------------|
| `id`               | Number  | PK, auto-incremento | Identificador único                    |
| `title`            | String  | NOT NULL            | Título da tarefa                       |
| `task_description` | String  | NOT NULL            | Descrição detalhada da tarefa          |
| `completed`        | Boolean | Default: `false`    | Status de conclusão da tarefa          |
| `user_id`          | Number  | FK → users(id)      | ID do usuário dono da tarefa           |

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para proteger as rotas de tarefas.

**Fluxo:**
1. O usuário realiza o login em `POST /users/login`
2. A API retorna um token JWT
3. O token deve ser enviado no header `Authorization` de todas as requisições protegidas

**Formato do header:**
```
Authorization: Bearer <seu_token_jwt>
```

O middleware `authJwtMiddleware` valida o token e injeta `req.userId` e `req.userName` nas requisições, garantindo que cada usuário acesse apenas seus próprios recursos.

---

## 🛣️ Rotas da API

### 👤 Usuários — `/users`

| Método | Endpoint          | Descrição                    | Autenticação |
|--------|-------------------|------------------------------|:------------:|
| POST   | `/users/register` | Cadastra um novo usuário     | ❌           |
| POST   | `/users/login`    | Autentica e retorna um token | ❌           |

---

#### `POST /users/register`
Cadastra um novo usuário. A senha é armazenada com hash bcrypt.

**Body:**
```json
{
  "name": "Ana Oliveira",
  "email": "ana@email.com",
  "password": "minhasenha123"
}
```

**Resposta de sucesso `200 OK`:**
```json
{
  "id": 1,
  "username": "Ana Oliveira",
  "email": "ana@email.com",
  "user_password": "$2a$10$..."
}
```

**Resposta de erro `401`** (campos ausentes):
```json
{
  "error": "O formulário foi preenchido incorretamente"
}
```

---

#### `POST /users/login`
Valida as credenciais com bcrypt e retorna um token JWT em caso de sucesso.

**Body:**
```json
{
  "email": "ana@email.com",
  "password": "minhasenha123"
}
```

**Resposta de sucesso `200 OK`:**
```json
{
  "status": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login realizado com sucesso"
}
```

**Resposta de erro `404`** (usuário não encontrado):
```json
{
  "status": 404,
  "message": "Usuário não encontrado"
}
```

---

### ✅ Tarefas — `/tasks`

> ⚠️ **Todas as rotas abaixo exigem autenticação via token JWT no header `Authorization`.**

| Método | Endpoint               | Descrição                          | Autenticação |
|--------|------------------------|------------------------------------|:------------:|
| POST   | `/tasks/create`        | Cria uma nova tarefa               | ✅           |
| DELETE | `/tasks/delete/:taskId`| Deleta uma tarefa do usuário logado| ✅           |

---

#### `POST /tasks/create` 🔒
Cria uma nova tarefa vinculada ao usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Estudar Node.js",
  "description": "Revisar middlewares e autenticação JWT",
  "completed": false
}
```

**Resposta de sucesso `200 OK`:**
```json
{
  "status": 200,
  "message": null
}
```

**Resposta de erro `404`** (body incompleto):
```json
{
  "status": 404,
  "message": "O body não foi preenchido corretamente"
}
```

---

#### `DELETE /tasks/delete/:taskId` 🔒
Deleta uma tarefa pelo ID, garantindo que ela pertença ao usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Parâmetro de rota:** `taskId` — ID numérico da tarefa

**Resposta de sucesso `200 OK`:**
```json
{
  "status": 200,
  "message": "Tarefa deletada com sucesso: ..."
}
```

**Resposta de erro `404`** (tarefa não encontrada ou não pertence ao usuário):
```json
{
  "status": 404,
  "message": "Tarefa não encontrada"
}
```

---

## 📋 Scripts Disponíveis

| Comando       | Descrição                                         |
|---------------|---------------------------------------------------|
| `npm run dev` | Inicia o servidor com hot reload (`node --watch`) |

---

## 📝 Observações de Segurança

- As senhas são protegidas com **bcrypt** antes de serem persistidas no banco
- O token JWT carrega apenas `id` e `name` do usuário no payload — nunca a senha
- A deleção de tarefas valida tanto o `taskId` quanto o `userId`, impedindo que um usuário delete tarefas de outro
- O arquivo `.env` está no `.gitignore` e **nunca deve ser versionado**