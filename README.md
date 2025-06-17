# 🎬 Movie Ticket Booking Platform — Microservices Architecture

A scalable movie ticket booking system built with **NestJS**, **gRPC**, **REST Gateway**, and modular microservices for clean separation of concerns.

---

## 📦 Project Structure

```
.
├── apps/
│   ├── gateway/           # REST API Gateway (HTTP + gRPC Clients)
│   ├── users/             # User Management Service (gRPC)
│   ├── movies/            # Movie Listing & Management Service (gRPC)
│   ├── theaters/          # Theater & Halls Service (gRPC)
│   ├── reservations/      # Seat Reservation Service (gRPC)
│   ├── tickets/           # Ticket Issuing Service (gRPC)
│   └── payments/          # Payment Processing Service (gRPC)
│
├── proto/                 # All .proto files (gRPC contracts)
│   ├── users.proto
│   ├── movies.proto
│   ├── theaters.proto
│   ├── reservations.proto
│   ├── tickets.proto
│   └── payments.proto
│
├── docker-compose.yml     # Optional: All services containerized
├── README.md              # You're reading it :)
└── package.json           # Workspace root (optional monorepo)
```

---

## ⚙️ Tech Stack

| Layer              | Technology            |
|-------------------|------------------------|
| Backend Framework | [NestJS](https://nestjs.com) |
| Protocol          | [gRPC](https://grpc.io) + [Protocol Buffers](https://protobuf.dev) |
| REST Gateway      | NestJS with gRPC Clients |
| Communication     | `@nestjs/microservices` |
| Database (per service) | PostgreSQL / MongoDB (based on domain) |
| Auth (optional)   | JWT / Session-based |
| Dev Tools         | Docker, ts-node-dev, .env configs |

---

## 💡 Microservices Overview

| Service        | Responsibilities                                      | Database    |
|----------------|--------------------------------------------------------|-------------|
| **Users**      | Register, login, get profile                          | PostgreSQL  |
| **Movies**     | List movies, manage details, showtimes                | MongoDB     |
| **Theaters**   | Manage locations, halls, seating layouts              | MongoDB     |
| **Reservations** | Reserve specific seats for a showtime              | PostgreSQL  |
| **Tickets**    | Generate digital tickets after payment                | PostgreSQL  |
| **Payments**   | Handle transactions via card/payment gateway APIs     | PostgreSQL  |
| **Gateway**    | Accepts HTTP requests, communicates with services     | —           |

---

## 🚀 How It Works

```
User -> Gateway (REST API)
     -> gRPC call to UsersService for auth
     -> gRPC call to MoviesService for showtimes
     -> gRPC call to TheatersService for seat map
     -> gRPC call to ReservationsService to lock seat
     -> gRPC call to PaymentsService to pay
     -> gRPC call to TicketsService to issue ticket
     -> REST response back to user
```

---

## 🛠 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/movie-booking-platform.git
cd movie-booking-platform

# Install packages (for all services)
npm install
```

---

## 📡 Running Locally

### Option 1 — Manual (Dev Mode)
Start each service in a separate terminal:

```bash
cd apps/users && npm run start:dev
cd apps/movies && npm run start:dev
cd apps/theaters && npm run start:dev
cd apps/reservations && npm run start:dev
cd apps/tickets && npm run start:dev
cd apps/payments && npm run start:dev
cd apps/gateway && npm run start:dev
```

### Option 2 — Docker (Recommended)
```bash
docker-compose up --build
```

---

## 🔐 Authentication

The `users` service handles login/registration and issues JWT tokens. The gateway validates tokens before forwarding requests.

---

## 📄 Proto File Example

```proto
// proto/users.proto
syntax = "proto3";

package users;

service UsersService {
  rpc GetUser(GetUserRequest) returns (UserResponse);
}

message GetUserRequest {
  string id = 1;
}

message UserResponse {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

---

## 🧪 Testing

Each microservice can be tested independently with:

```bash
npm run test
```

For e2e testing via REST (gateway):
```bash
curl http://localhost:3000/users/123
```

---

## 🌍 API Endpoints (via Gateway)

| Method | Endpoint             | Description                   |
|--------|----------------------|-------------------------------|
| GET    | `/users/:id`         | Get user profile              |
| GET    | `/movies`            | List all movies               |
| POST   | `/reservations`      | Reserve a seat                |
| POST   | `/payments/charge`   | Pay for a ticket              |

*All REST routes proxy through gRPC.*

---

## 🤝 Contributing

Pull requests welcome! This architecture is a great base for:
- E-commerce
- Booking systems
- Modular monolith-to-microservice migration

---

## 🧠 Concepts to Learn

- NestJS Microservices Module
- gRPC with Protocol Buffers
- Service-to-service communication
- Gateway pattern
- Database per service
- Message brokers (future: Kafka/NATS)

---

## 📬 Contact

Made with ❤️ by [Your Name]  
Telegram: [@yourhandle](https://t.me/sdezreg)