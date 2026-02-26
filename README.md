# Online Bank Mini System

A full-stack banking application built with **Next.js** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

| Feature | Route |
|---|---|
| View all accounts | `GET /api/accounts` |
| Create account | `POST /api/accounts/create` |
| Deposit | `POST /api/accounts/deposit` |
| Withdraw | `POST /api/accounts/withdraw` |
| Transfer | `POST /api/accounts/transfer` |

## Project Structure

```
assignment/
├── backend/             # Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── config/db.ts         # Mongoose connection
│   │   ├── models/              # Account model
│   │   ├── controllers/         # API logic
│   │   ├── routes/              # Express routes
│   │   └── server.ts            # Entry point
│   ├── .env                     # Environment variables (not committed)
│   └── package.json
│
└── frontend/            # Next.js 16 App Router + TypeScript
    ├── src/app/
    │   ├── page.tsx             # Account listing
    │   ├── accounts/page.tsx    # Create account
    │   ├── transactions/page.tsx
    │   └── transfer/page.tsx
    ├── src/components/Nav.tsx   # Shared nav
    └── .env.local               # NEXT_PUBLIC_API_URL
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally **or** a MongoDB Atlas URI

## Setup & Run

### 1. Backend

```bash
cd backend
npm install

# Edit .env — set your MongoDB URI:
#   MONGODB_URI=mongodb://localhost:27017/online-bank
#   PORT=5000

npm run dev
# Server starts at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install

# .env.local already set to http://localhost:5000
# Update NEXT_PUBLIC_API_URL if backend runs on a different host/port

npm run dev
# App starts at http://localhost:3000
```

## Pages

| URL | Description |
|---|---|
| `/` | All accounts table with live refresh |
| `/accounts` | Create new account form |
| `/transactions` | Deposit / Withdraw |
| `/transfer` | Transfer between accounts |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Server port (default `5000`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:5000`) |

## API Reference

### `GET /api/accounts`
Returns all accounts sorted by newest first.

### `POST /api/accounts/create`
```json
{ "holderName": "string", "isKYCVerified": true }
```

### `POST /api/accounts/deposit`
```json
{ "accountNo": "ACC-...", "amount": 5000 }
```

### `POST /api/accounts/withdraw`
```json
{ "accountNo": "ACC-...", "amount": 2000 }
```
Returns `400` if balance is insufficient.

### `POST /api/accounts/transfer`
```json
{ "senderAccount": "ACC-...", "receiverAccount": "ACC-...", "amount": 1000 }
```
Checks: KYC verified sender · sufficient balance · different accounts.

## Production Build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```
