# 🚑 Emergency Ambulance Dispatch System - Backend API

A scalable, secure, and robust RESTful API built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Designed for real-time emergency healthcare logistics, managing dynamic vehicle assignments, multi-role access control, and payment processing.

---

## 🌐 Live URL & API Documentation

- **Live Production API:** [Deploy Link Here - e.g., https://your-app.onrender.com]
- **API Base Route:** `/api/v1`
- **Postman Documentation / Collection:** Included in the root directory as `ambulance_dispatch_postman_collection.json`
- **Walkthrough Video:** [Video Link Here - YouTube Unlisted or Google Drive]

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js
- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **In-Memory Store:** Redis (`ioredis`)
- **Data Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **Payment Gateway:** bKash Sandbox Integration

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Strict authentication & authorization for 3 distinct roles: `ADMIN`, `DRIVER`, and `CALLER`.
- **Automated Database Seeding:** Automatically creates default accounts for all three roles on server launch from `.env` configurations.
- **Emergency Lifecycle Management:** End-to-end request tracking with dynamic statuses (`PENDING` ➔ `ASSIGNED` ➔ `EN_ROUTE` ➔ `PICKED_UP` ➔ `COMPLETED` / `CANCELLED`).
- **Transaction-Safe Dispatching:** Uses `prisma.$transaction` to guarantee database consistency when allocating available ambulances and drivers.
- **Input Validation & Structured Errors:** Zod schema parsing on incoming payloads with standardized global error handling.
- **Payment Processing:** Integrated bKash payment gateway lifecycle with transaction ID verification and status updating.
- **Performance & Soft Deletion:** Optimized with PostgreSQL indexing and soft-delete flags (`isDeleted`) across key models.

---

## 👥 Default Demo Credentials (Auto-Seeded)

| Role | Email | Password |
| :--- | :--- | :--- |
| **ADMIN** | `admin@example.com` | `Admin@password123` |
| **DRIVER** | `driver@example.com` | `Driver@password123` |
| **CALLER** | `caller@example.com` | `Caller@password123` |

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following keys:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/ambulance_dispatch_db?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="your_jwt_secret_key"
JWT_ACCESS_EXPIRES_IN="7d"

# Redis Configuration
REDIS_URL="redis://default:password@host:port"

# Default Seed Users
ADMIN_NAME="System Admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@password123"

DRIVER_NAME="Default Driver"
DRIVER_EMAIL="driver@example.com"
DRIVER_PASSWORD="Driver@password123"

CALLER_NAME="Default Caller"
CALLER_EMAIL="caller@example.com"
CALLER_PASSWORD="Caller@password123"

# bKash Sandbox Credentials
BKASH_APP_KEY="your_bkash_app_key"
BKASH_APP_SECRET="your_bkash_app_secret"
BKASH_USERNAME="your_bkash_username"
BKASH_PASSWORD="your_bkash_password"
BKASH_BASE_URL="[https://tokenized.sandbox.bka.sh/v1.2.0-beta](https://tokenized.sandbox.bka.sh/v1.2.0-beta)"