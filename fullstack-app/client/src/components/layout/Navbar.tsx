import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link to="/" className="text-xl font-bold">
                    EventApp
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === "ADMIN" && (
                                <Link to="/admin">
                                    <Button variant="ghost">Admin Panel</Button>
                                </Link>
                            )}
                            {user.role === "ORGANIZER" && (
                                <Link to="/organizer">
                                    <Button variant="ghost">Organizer Dashboard</Button>
                                </Link>
                            )}
                            {user.role === "ATTENDEE" && (
                                <>
                                    <Link to="/events">
                                        <Button variant="ghost">Browse Events</Button>
                                    </Link>
                                    <Link to="/my-bookings">
                                        <Button variant="ghost">My Bookings</Button>
                                    </Link>
                                </>
                            )}

                            <span className="text-sm text-muted-foreground mr-2">
                                {user.username} ({user.role})
                            </span>
                            <Button onClick={handleLogout} variant="outline">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
