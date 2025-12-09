import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner"; // Using sonner as recommended

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email, password });
            login(data.token, data.user);
            toast.success("Login successful");
            if (data.user.role === "ADMIN") navigate("/admin");
            else if (data.user.role === "ORGANIZER") navigate("/organizer");
            else navigate("/events");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
