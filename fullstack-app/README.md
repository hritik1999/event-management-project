
# Event Management System

A full-stack web application for managing events, bookings, and user roles (Admin, Organizer, Attendee).

## 🚀 Features

-   **Authentication**: Secure Login/Signup with role-based access control (RBAC).
-   **User Roles**:
    -   **Admin**: View platform stats, revenue analytics, and approve/reject organizer accounts.
    -   **Organizer**: Create, edit, and manage events.
    -   **Attendee**: Browse events, book tickets, and write reviews.
-   **Event Management**: CRUD operations for events with categories, locations, and ticket types.
-   **Booking System**: Real-time ticket booking with stock management.
-   **Analytics Dashboard**: Visual charts for revenue trends, bookings over time, and event distribution.
-   **Review System**: Attendees can rate and review events they have attended.

## 🛠️ Tech Stack

### Frontend uses:
-   **React** (Vite Project)
-   **TypeScript** for type safety
-   **Tailwind CSS v4** for styling
-   **Shadcn UI** for accessible components
-   **Recharts** for data visualization
-   **Axios** for API communication

### Backend uses:
-   **Node.js** & **Express.js**
-   **TypeScript**
-   **TypeORM** (Data Mapper pattern)
-   **PostgreSQL** (Relational Database)
-   **JWT** (JSON Web Tokens) for stateless authentication

## 📂 Project Structure

```
event-management/
├── fullstack-app/
│   ├── client/       # Frontend React Application
│   └── server/       # Backend Express API
```

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18+)
-   PostgreSQL local instance

### 1. Setup Backend
```bash
cd fullstack-app/server
npm install
# Create a .env file based on explicit configuration
npm start
```

### 2. Setup Frontend
```bash
cd fullstack-app/client
npm install
npm run dev
```

## 🧪 Key Implementation Details
-   **Stateless Auth**: Uses `auth.middleware.ts` to intercept requests and verify JWT tokens from `Authorization` header.
-   **Aggregated Stats**: `AdminService` uses TypeORM `QueryBuilder` to perform complex SQL joins and aggregations for the analytics dashboard.
-   **Defensive Frontend**: The UI is built to handle missing data gracefully, ensuring the admin dashboard never crashes even with empty datasets.

## 👥 Contributors
-   Hritik
