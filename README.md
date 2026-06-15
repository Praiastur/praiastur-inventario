# Praiastur Inventário

Sistema interno de controle de inventário administrativo e operacional da Praiastur.

O projeto foi desenvolvido para organizar materiais administrativos, controlar entradas e saídas de estoque, registrar movimentações, gerenciar residenciais, apartamentos, itens operacionais e imagens dos itens cadastrados.

---

## Objetivo do Sistema

O objetivo do Praiastur Inventário é permitir que a empresa tenha controle claro sobre:

* Quais materiais existem em estoque;
* Qual a quantidade atual de cada produto;
* Quais entradas e saídas foram registradas;
* Quem realizou cada movimentação;
* Quais residenciais existem;
* Quais apartamentos ou espaços pertencem a cada residencial;
* Quais itens existem em cada apartamento;
* Qual o status de conservação dos itens;
* Quais registros estão ativos ou inativos;
* Histórico das principais ações realizadas no sistema.

---

## Módulos do Sistema

### Administrativo

* Produtos administrativos;
* Entradas de materiais;
* Saídas de materiais;
* Cancelamento de saída;
* Controle automático de estoque;
* PDF de comprovante de saída;
* Produtos com estoque baixo.

### Operacional / Predial

* Cadastro de residenciais;
* Cadastro de apartamentos e espaços;
* Cadastro de itens operacionais;
* Status dos itens:

  * Bom;
  * Atenção;
  * Problema;
  * Em falta;
* Upload de imagens para residenciais;
* Upload de imagens para apartamentos;
* Upload de imagens para itens operacionais.

### Sistema

* Login com JWT;
* Usuário administrador inicial;
* Cadastro de usuários;
* Permissões por perfil;
* Histórico de movimentações;
* Dashboard com resumo geral;
* Reativação de registros inativos.

---

## Tecnologias Utilizadas

### Back-end

* Node.js;
* Express;
* Sequelize;
* MySQL;
* JWT;
* Bcrypt;
* Multer;
* PDFKit;
* CORS;
* Dotenv.

### Front-end

* React;
* Vite;
* JavaScript;
* Axios;
* React Router DOM;
* CSS.

---

## Estrutura do Projeto

```txt
praiastur-inventario/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server/
│   ├── services/
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── styles/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/praiastur-inventario.git
```

Depois entre na pasta:

```bash
cd praiastur-inventario
```

---

## Configuração do Back-end

Entre na pasta do back-end:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `backend`, usando o `.env.example` como base:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=praiastur_inventario

ADMIN_NAME=Usuário ADM
ADMIN_EMAIL=admin@praiastur.com.br
ADMIN_PASSWORD=123456

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d

PORT=3000
```

Sincronize o banco de dados:

```bash
npm run db:sync
```

Inicie o servidor:

```bash
npm run dev
```

O back-end deverá rodar em:

```txt
http://localhost:3000
```

---

## Configuração do Front-end

Em outro terminal, entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o front-end:

```bash
npm run dev
```

O front-end deverá rodar em:

```txt
http://localhost:5173
```

---

## Usuário Administrador Inicial

Após rodar o comando de sincronização do banco, o sistema cria um usuário administrador inicial com os dados definidos no `.env`.

Exemplo:

```txt
E-mail: admin@praiastur.com.br
Senha: 123456
```

---

## Scripts do Back-end

Dentro da pasta `backend`:

```bash
npm run dev
```

Roda o servidor em modo desenvolvimento.

```bash
npm run start
```

Roda o servidor em modo normal.

```bash
npm run db:sync
```

Cria/verifica o banco de dados e as tabelas.

---

## Scripts do Front-end

Dentro da pasta `frontend`:

```bash
npm run dev
```

Roda o front-end em modo desenvolvimento.

```bash
npm run build
```

Gera a versão final de produção.

---

## Observações Importantes

O arquivo `.env` não deve ser enviado para o GitHub, pois contém senhas e chaves privadas.

A pasta `node_modules` também não deve ser enviada para o GitHub.

As imagens enviadas pelo sistema ficam dentro da pasta `backend/uploads`, mas os arquivos enviados não são versionados no Git.

As pastas de upload são mantidas no projeto usando arquivos `.gitkeep`.

---

## Status Atual do Projeto

Primeira versão funcional do sistema, contendo:

* Back-end estruturado;
* Banco de dados MySQL;
* Autenticação;
* Permissões;
* Dashboard;
* Produtos administrativos;
* Entradas;
* Saídas;
* Cancelamento de saída;
* PDF de saída;
* Residenciais;
* Apartamentos;
* Itens operacionais;
* Upload de imagens;
* Usuários;
* Histórico;
* Front-end em React.

---

## Próximas Melhorias

* Melhorar validações no front-end;
* Melhorar mensagens de erro e sucesso;
* Melhorar o PDF de saída com layout mais profissional;
* Criar relatórios;
* Criar paginação;
* Criar exportação para Excel;
* Melhorar responsividade em telas menores;
* Melhorar identidade visual com logo e cores oficiais.
