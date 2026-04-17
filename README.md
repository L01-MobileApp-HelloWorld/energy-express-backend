# Energy Express Backend

Backend mẫu dùng **ExpressJS + TypeScript + Prisma + Swagger**.

## Yêu cầu

- Node.js `>= 20.14.0`

## Cài đặt

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

Server chạy mặc định ở `http://localhost:3000`.

Swagger UI: `http://localhost:3000/docs`

## Endpoint

- `GET /health`
- `GET /questions`
- `POST /questions`
- `GET /answers`
- `POST /answers`
- `GET /categories`
- `POST /categories`

### Payload tạo question

```json
{
  "name": "What is Node.js?",
  "description": "Basic question",
  "answerId": 1,
  "categoryId": 1
}
```

## Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format:check
npm run format
```
