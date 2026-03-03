# DreamerPortal Ironhack MVP

DreamerPortal é uma plataforma de registro simbólico onde a pessoa usuária cria ciclos, registra sonhos e transforma insights em ações concretas.

## Architecture

- `server/` API Express + MongoDB com estrutura modular por domínio
- `client/` App React + Vite com rotas protegidas e fluxo principal

Fluxo central do domínio:

Dream → Meaning-ready Analysis → Action Task

## Backend setup

1. Copy `server/.env.example` to `server/.env`
2. Fill MongoDB and JWT values
3. Opcional (recomendado): preencher credenciais Cloudinary para anexos de sonhos
4. Run:

```bash
cd server
npm install
npm run dev
```

## Frontend setup

1. Copy `client/.env.example` to `client/.env`
2. Confirm `VITE_API_URL` points to backend URL
3. Run:

```bash
cd client
npm install
npm run dev
```

## MVP endpoints

- Auth: `POST /auth/signup`, `POST /auth/login`, `GET /auth/verify`
- Projects: `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`
- Dreams: `GET/POST /api/projects/:projectId/dreams`, `GET/PUT/DELETE /api/dreams/:id`
- Tasks: `GET/POST /api/projects/:projectId/tasks`, `PUT/DELETE /api/tasks/:id`

All domain routes are owner-scoped and implement soft delete where applicable.

## Funcionalidades implementadas

- Autenticação completa (signup/login/verify)
- Rotas privadas com isolamento por owner
- CRUD de ciclos na UI (criar, editar, arquivar, reativar)
- CRUD de sonhos na UI (criar, editar, arquivar)
- CRUD de ações na UI (criar, editar, status, arquivar)
- Filtros de ciclos, sonhos e ações
- Upload de imagem para sonho via Cloudinary (UI + API)

## Como testar upload de imagem

1. Garanta que `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` estão no `server/.env`
2. Inicie backend e frontend
3. Entre em um ciclo
4. Na aba de sonhos, selecione uma imagem no campo `Imagem do sonho (opcional)`
5. Salve o sonho e abra o link `Ver imagem` no item criado

## Checklist final para apresentação Ironhack

- [x] Auth + private routes
- [x] CRUD completo no frontend e backend
- [x] Relações entre modelos
- [x] Search/filter em múltiplas entidades
- [x] Integração com pacote/serviço externo (Cloudinary)
- [ ] Deploy backend (Render/Railway)
- [ ] Deploy frontend (Vercel)
- [ ] Atualizar README com links finais de produção e demo

## Publicar no GitHub

No diretório raiz do projeto:

```bash
git add .
git commit -m "feat: DreamerPortal MVP Ironhack"
```

Crie o repositório no GitHub (via site) e depois rode:

```bash
git remote add origin https://github.com/SEU-USUARIO/dreamerportal-ironhack.git
git push -u origin main
```

Opcional com GitHub CLI:

```bash
gh repo create dreamerportal-ironhack --public --source=. --remote=origin --push
```
