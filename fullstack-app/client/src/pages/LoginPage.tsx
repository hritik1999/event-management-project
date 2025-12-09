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
        <div className="flex justify-center items-center min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-[-20%] right-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2">
                        <span className="text-primary-foreground font-bold text-2xl">E</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-background/50 border-input/50 focus:border-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                className="bg-background/50 border-input/50 focus:border-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
