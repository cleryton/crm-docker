# CRM Demo (Login, Registro e Dashboard)

Projeto mínimo para validação: Node.js + Express + SQLite, rodando em Docker.
Já testado localmente (registro, login, rota protegida e dados do CRM funcionando).

## Rodando com Docker (recomendado)

```bash
docker compose up --build -d
```

Acesse: http://localhost:3000/login.html

Para derrubar:
```bash
docker compose down
```

Os dados ficam salvos no volume `crm-data` (sqlite), então persistem entre reinícios.

## Rodando sem Docker (dev local)

```bash
npm install
npm start
```

## Rotas da API

- `POST /api/register` — { name, email, password }
- `POST /api/login` — { email, password }
- `POST /api/logout`
- `GET /api/me` — protegida (cookie JWT)
- `GET /api/clientes` — protegida, retorna clientes de exemplo
- `GET /api/health` — healthcheck

## Estrutura

```
crm-docker/
├── Dockerfile
├── docker-compose.yml
├── server.js          # rotas + auth (JWT em cookie httpOnly)
├── db.js              # SQLite (better-sqlite3), cria tabelas e dados de exemplo
└── public/
    ├── login.html
    ├── register.html
    ├── dashboard.html  # tela inicial estilo CRM (cards + tabela de clientes)
    ├── css/style.css
    └── js/
```

## Observação de segurança

Troque `JWT_SECRET` (no `docker-compose.yml`) por um valor forte antes de qualquer uso real.
