# BMI Backend

Small Express + Postgres API for the BMI app.

Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres connection (pgAdmin can provide this).

2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the server (dev with nodemon):

```bash
npm run dev
```

Endpoints

- `GET /api/health` — health check
- `GET /api/records` — list saved BMI records
- `POST /api/records` — save a record (JSON body: `username,email,bmi,category,height,weight`)

Notes

The `migrations/init.sql` file is executed on startup to create the `records` table if it doesn't exist.
