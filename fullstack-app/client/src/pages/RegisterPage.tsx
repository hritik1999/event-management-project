import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";

export function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "ATTENDEE"
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Register
            await api.post("/auth/register", formData);
            toast.success("Registration successful! Logging in...");

            // Auto login
            const { data } = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password
            });

            login(data.token, data.user);

            if (data.user.role === "ADMIN") navigate("/admin");
            else if (data.user.role === "ORGANIZER") {
                toast.info("Organizer account created. Please wait for admin approval.");
                navigate("/organizer");
            }
            else navigate("/events");

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-background relative overflow-hidden">
            <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    <p className="text-sm text-muted-foreground">Join the community to manage or discover events</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" className="bg-background/50 border-input/50" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" className="bg-background/50 border-input/50" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" className="bg-background/50 border-input/50" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select onValueChange={handleRoleChange} defaultValue="ATTENDEE">
                                <SelectTrigger className="bg-background/50 border-input/50">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ATTENDEE">Attendee</SelectItem>
                                    <SelectItem value="ORGANIZER">Event Organizer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20">Register</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
