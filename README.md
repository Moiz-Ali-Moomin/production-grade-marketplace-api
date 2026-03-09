# Marketplace API - Enterprise Backend

## Project Overview

This is a production-grade marketplace backend built with **Node.js** and **TypeScript**. It implements a high-performance, scalable modular architecture designed for high-traffic environments. The system features a clean separation of concerns through repository patterns, dependency injection, asynchronous background processing with BullMQ, and comprehensive production observability.

---

## System Design

The project follows **Clean Architecture** principles to ensure maintainability and loose coupling between business logic and infra-level details.

### Architecture Flow
```text
Client (Mobile/Web) ──▶ API Layer (Express) ──▶ Service Layer (Business Logic) ──▶ Repository Layer (Data Abstraction) ──▶ Infrastructure (Prisma/PostgreSQL)
                               │
                               └─▶ Event Bus ──▶ Background Workers (BullMQ/Redis)
```

### Layer Responsibilities
- **API Layer**: Handles HTTP requests, authentication, and request validation.
- **Service Layer**: Orchestrates business logic and emits domain events.
- **Repository Layer**: Abstracts data access logic, making services database-agnostic through interfaces.
- **Infrastructure**: Handles external integrations like database (Prisma), caching (Redis), and payments (Stripe).

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **API Framework** | Node.js + Express |
| **Language** | TypeScript (Strict Mode) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Cache & Queue** | Redis + BullMQ |
| **Dependency Injection** | tsyringe |
| **Payments** | Stripe |
| **Observability** | Prometheus + Pino (Structured Logging) |

---

## Architecture Principles

- **Modular Domain Architecture**: Domain-based encapsulation (Auth, Product, Order) for scalability.
- **Separation of Concerns**: Clear boundary between domain logic and infrastructure.
- **Clean Architecture**: Services depend on abstractions (Repository Interfaces) rather than concrete implementations.
- **Event-Driven Design**: Asynchronous side effects via a centralized Event Bus and Background Workers.
- **Production Observability**: Built-in metrics, tracing, and structured logging for monitoring.
- **Type-Safe APIs**: End-to-end type safety using TypeScript.

---

## Project Structure

```text
src/
├── modules/          # Domain-specific modules (Auth, Product, Order, etc.)
├── infrastructure/   # Database, Cache, Messaging, Payments
├── events/           # Domain Event Bus and Event Handlers
├── workers/          # BullMQ Background Workers
├── observability/    # Logger, Metrics, Tracing, Health checks
├── middleware/       # Security, Validation, Error Handling
├── container/        # Dependency Injection Container
├── config/           # Environment configuration
└── utils/            # Shared utilities
```

- **modules/**: Each domain contains its own `controllers`, `services`, `repositories`, `interfaces`, `mappers`, and `validators`.
- **infrastructure/**: Encapsulates third-party drivers and database configuration.
- **events/**: Orchestrates internal communication between decoupled services.

---

## Features

- ✅ **Clean Repository Pattern**: Decoupled data access using interfaces.
- ✅ **Mapper Layer**: Explicit transformation between DB entities and DTOs.
- ✅ **Background Processing**: Reliable job queues for tasks like emails and order processing.
- ✅ **Observability**: Real-time monitoring via Prometheus metrics and health endpoints.
- ✅ **Security**: Helmet, CORS, and robust Rate Limiting out of the box.
- ✅ **Real-time**: High-performance Socket.io integration for instant updates.
- ✅ **Type Safety**: Zod for schema-based request validation.

---

## Example API Request

### Create Product
`POST /api/v1/products`

**Request Body:**
```json
{
  "title": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 299.99,
  "stock": 50,
  "categoryId": "cat_123",
  "tags": ["electronics", "audio"]
}
```

**Response (201 Created):**
```json
{
  "id": "prod_789",
  "title": "Wireless Headphones",
  "price": 299.99,
  "stock": 50,
  "status": "success"
}
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis
- Docker (optional)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your credentials.
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

### Running Locally
```bash
npm run dev
```

### Testing
```bash
npm test
```

---

## API Documentation
- `GET /health`: System health status (DB, Redis).
- `GET /metrics`: Prometheus performance metrics.
- `GET /api/v1/...`: Application domain endpoints.

## License
MIT
