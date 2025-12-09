import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { Toaster } from "./components/ui/sonner";

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Organizer Routes */}
        <Route path="/organizer" element={
          <ProtectedRoute roles={["ORGANIZER"]}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />

        {/* Attendee Routes */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />

        <Route path="/my-bookings" element={
          <ProtectedRoute roles={["ATTENDEE"]}>
            <MyBookingsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
