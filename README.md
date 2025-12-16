# 🌦️ Weather App (React + TypeScript + Prisma + PostgreSQL)

Веб-приложение погоды с **React (Vite)** на фронтенде и **Node.js + TypeScript + Prisma** на бэкенде.

Проект находится **в одном репозитории без разделения на client/server**, сервер и фронтенд запускаются из корня.

---

## 🚀 Стек технологий

**Frontend**

* React
* Vite
* JavaScript / TypeScript
* CSS

**Backend**

* Node.js
* TypeScript
* Prisma ORM
* PostgreSQL

---

## 📁 Структура проекта

```text
weather2/
├── prisma/                # Prisma schema и миграции
├── src/                   # React frontend
│   ├── assets/
│   ├── generated/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── server.ts              # Backend сервер (Node.js + TS)
├── prisma.config.ts
├── vite.config.js
├── index.html
├── .env
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## ⚙️ Предварительные требования

Убедись, что установлено:

* **Node.js** (v18+)
* **pnpm / npm**
* **PostgreSQL**

PostgreSQL должен быть запущен локально:

```
localhost:5432
```

---

## 🗄️ Настройка базы данных

1. Создай базу данных в PostgreSQL (например `weather_db`)

2. В корне проекта создай файл **.env**:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/weather_db"
```

3. Применить миграции Prisma:

```bash
npx prisma migrate dev
```

---

## 📦 Установка зависимостей

В корне проекта:

```bash
pnpm install
# или
npm install
```

---

## ▶️ Запуск backend-сервера

Сервер запускается из корня проекта:

```bash
npx nodemon server.ts
```

По умолчанию:

```
http://localhost:3000
```

---

## ▶️ Запуск frontend-приложения

В новой вкладке терминала:

```bash
npm run dev
# или
pnpm dev
```

Frontend будет доступен по адресу:

```
http://localhost:5173
```

---

## 🔑 Переменные окружения

### Backend

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/weather_db
```

### Frontend (если используется API погоды)

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

---

## 🛠️ Полезные команды

```bash
npx prisma studio      # GUI для базы данных
npx prisma generate   # Генерация Prisma Client
```

