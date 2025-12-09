
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { LogOut, Ticket, Settings, PlusCircle, LayoutDashboard, Calendar } from "lucide-react";

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        E
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">EventFlow</span>
                </Link>

                {/* Navigation Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === "ATTENDEE" && (
                                <>
                                    <Link to="/events">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Browse Events
                                        </Button>
                                    </Link>
                                    <Link to="/my-bookings">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <Ticket className="h-4 w-4" />
                                            My Bookings
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {user.role === "ORGANIZER" && (
                                <div className="flex items-center gap-2">
                                    <Link to="/organizer">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/organizer?action=create">
                                        <Button size="sm" className="gap-2">
                                            <PlusCircle className="h-4 w-4" />
                                            Create Event
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {user.role === "ADMIN" && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <Settings className="h-4 w-4" />
                                        Admin Panel
                                    </Button>
                                </Link>
                            )}

                            <div className="flex items-center gap-4 pl-4 border-l ml-2">
                                <span className="text-sm font-medium text-muted-foreground hidden md:block">
                                    {user.username}
                                </span>
                                <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
