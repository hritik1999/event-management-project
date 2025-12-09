
# Event Management - Client (Frontend)

The frontend application is built with **React** and **Vite**, focusing on performance, type safety, and a premium user experience.

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── ui/           # Shadcn UI reusable components (Button, Card, Input...)
│   └── ...           # Custom components
├── context/
│   └── AuthContext.tsx # Global authentication state (User, Token, Login/Logout)
├── lib/
│   ├── api.ts        # Axios instance with Interceptors for auto-token injection
│   └── utils.ts      # Helper functions (Tailwind class merger)
├── pages/
│   ├── AdminDashboard.tsx  # Admin Analytics & Approvals
│   ├── OrganizerDashboard.tsx # Event Creation & Management
│   ├── HomePage.tsx        # Attendee Event Browsing
│   └── ...
├── App.tsx           # Main Router Configuration (React Router v6)
└── main.tsx          # Entry point
```

## 🔑 Key Features & Implementation

### 1. Authentication (`AuthContext`)
-   Wraps the entire app to provide `user` and `token` state.
-   Persists login state via `localStorage`.
-   **Hook**: `useAuth()` allows any component to access current user role and logout function.

### 2. API Communication (`lib/api.ts`)
-   Centralized **Axios** instance.
-   **Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` to every request if a token exists.
-   **Response Interceptor**: Handles global errors (e.g., redirect on 401).

### 3. Admin Dashboard (`AdminDashboard.tsx`)
-   **Visual Analytics**: Integrated `recharts` to display:
    -   *Bookings Trend*: Bar Chart (Fixed height 300px).
    -   *Events Distribution*: Pie Chart.
    -   *Revenue Analysis*: Bar Chart by Organizer.
-   **State Management**: Uses `useState` to store stats and `useEffect` to fetch them on mount.
-   **Defensive Coding**: Implements strict null checks (e.g., `(stats.totalRevenue || 0).toFixed(2)`) to prevent crashes if the backend returns incomplete data.

### 4. UI Library (Shadcn UI)
-   Built on top of **Radix Primitives** and **Tailwind CSS**.
-   Components reside in `src/components/ui/`.
-   Used for all interactive elements: `Dialog` (Modals), `Card` (Layouts), `Table` (Data display).

## 🚀 Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install all dependencies |
| `npm run dev` | Start local development server (Port 5173) |
| `npm run build` | Compile TypeScript and build for production |
