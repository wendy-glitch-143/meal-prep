# Prepd — Quick Meal Prep Planner

Daily and weekly meal planner built with **Vite + Vue 3**, **Express**, and **MySQL**. Choose recipes for the week and auto-generate a grocery list.

## Setup

1. Start MySQL with Docker (easiest if MySQL is not installed):

```bash
docker compose up -d
```

This starts MySQL on port **3307** (3306 is often already used).

Or install MySQL locally, then set `DB_PASSWORD` in `server/.env`.

2. Install dependencies and create the database:

```bash
npm install
npm run db:init
```

## Run

In two terminals:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

- App: http://localhost:5173
- API: http://localhost:3001

Sign up, add your own recipes on **Menu**, drop them into the **Planner**, then check **Grocery**.
