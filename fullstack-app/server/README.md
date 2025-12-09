
# Event Management - Server (Backend)

The backend is a robust REST API built with **Node.js**, **Express**, and **TypeScript**, using **TypeORM** for object-relational mapping to a PostgreSQL database.

## 🏗️ Architecture

### Folder Structure
```
src/
├── entities/       # Database Models (User, Event, Booking, Review)
├── controllers/    # Request Handlers (Logic extraction)
├── services/       # Business Logic (DB interactions, Aggregations)
├── routes/         # API Endpoint Definitions
├── middlewares/    # Auth & Validation Middleware
└── data-source.ts  # Database Connection Configuration
```

## 🔐 Core Modules

### 1. Authentication & Security
-   **JWT Strategy**: Uses `jsonwebtoken` to issue signed tokens upon login.
-   **Middleware (`auth.middleware.ts`)**: 
    -   Extracts token from `Authorization` header.
    -   Verifies signature.
    -   Attaches `user` object to the request.
    -   Enforces Role-Based Access Control (RBAC) via `authorizeRoles(...)`.

### 2. Database Entities (TypeORM)
-   **User**: Stores credentials and roles (`ADMIN` | `ORGANIZER` | `ATTENDEE`).
-   **Event**: Linked to an Organizer. Contains category, location, and date.
-   **TicketType**: Defines price and quantity for an event.
-   **Booking**: Junction table linking `User` and `TicketType` with a status.
-   **Review**: Links `User` and `Event` with a rating.

### 3. Advanced Analytics (`AdminService.ts`)
The `getStats()` method performs complex database aggregations using TypeORM's `QueryBuilder`:
-   **Group By Category**: Counts events per category.
-   **Revenue Calculation**: JOINs `Booking` -> `TicketType` and SUMs the `price` for all `CONFIRMED` bookings.
-   **Organizer Revenue**: Groups confirmed booking revenue by the Event's Organizer.

### 4. API Endpoints

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Login user & return JWT | Public |
| GET | `/api/events` | List all events | Public |
| POST | `/api/events` | Create new event | Organizer |
| POST | `/api/bookings` | Book a ticket | Attendee |
| GET | `/api/admin/stats` | Get Dashboard Analytics | Admin |
| GET | `/api/users/pending` | Get unauthorized organizers | Admin |

## 🚀 Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm start` | Start production server (node dist/server.js) |
| `npm run dev` | Start development server (nodemon) |
| `npm run build` | Compile TypeScript to JavaScript |
