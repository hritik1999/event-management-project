import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Users, Calendar, Ticket, UserCheck, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface HelperUser {
    id: string;
    username: string;
    email: string;
    role: string;
    isApproved: boolean;
}

interface AdminStats {
    totalUsers: number;
    totalOrganizers: number;
    totalAttendees: number;
    totalEvents: number;
    totalBookings: number;
    eventsByCategory: { name: string; value: number }[];
    bookingsTrend: { name: string; bookings: number }[];
    totalRevenue: number;
    revenueByOrganizer: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AdminDashboard() {
    const [pendingOrganizers, setPendingOrganizers] = useState<HelperUser[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);

    const fetchPending = async () => {
        try {
            const { data } = await api.get("/users/pending-organizers");
            setPendingOrganizers(data);
        } catch (error) {
            console.error("Failed to fetch pending organizers");
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get("/admin/stats");
            console.log("Admin Stats Data:", data);
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    useEffect(() => {
        fetchPending();
        fetchStats();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.put(`/users/${id}/approve`);
            toast.success("Organizer approved");
            fetchPending();
            fetchStats(); // Update stats as well
        } catch (error) {
            toast.error("Failed to approve organizer");
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Section */}
            {stats && (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { title: "Total Users", icon: Users, value: stats.totalUsers },
                            { title: "Organizers", icon: Shield, value: stats.totalOrganizers },
                            { title: "Attendees", icon: UserCheck, value: stats.totalAttendees },
                            { title: "Total Events", icon: Calendar, value: stats.totalEvents },
                            { title: "Total Bookings", icon: Ticket, value: stats.totalBookings },
                            { title: "Total Revenue", icon: null, value: `$${(stats.totalRevenue || 0).toFixed(2)}`, isMoney: true }
                        ].map((item, index) => (
                            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                                    {item.icon ? <item.icon className="h-4 w-4 text-primary" /> : <span className="text-primary font-bold">$</span>}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold tracking-tight">{item.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="col-span-1 border-border/50 shadow-xl shadow-primary/5">
                            <CardHeader>
                                <CardTitle>Bookings Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.bookingsTrend || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'oklch(var(--card))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                cursor={{ fill: 'oklch(var(--muted)/0.5)' }}
                                            />
                                            <Bar dataKey="bookings" fill="oklch(var(--primary))" radius={[4, 4, 0, 0]} name="Bookings" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 border-border/50 shadow-xl shadow-primary/5">
                            <CardHeader>
                                <CardTitle>Events by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={stats.eventsByCategory || []}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {(stats.eventsByCategory || []).map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: 'oklch(var(--card))', borderRadius: '8px', border: 'none' }} />
                                            <Legend iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 border-border/50 shadow-xl shadow-primary/5">
                            <CardHeader>
                                <CardTitle>Revenue by Organizer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.revenueByOrganizer || []} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: 'oklch(var(--card))', borderRadius: '8px', border: 'none' }} cursor={{ fill: 'oklch(var(--muted)/0.5)' }} />
                                            <Bar dataKey="value" fill="oklch(var(--secondary-foreground))" radius={[0, 4, 4, 0]} name="Revenue ($)" barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Pending Organizer Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingOrganizers.length === 0 ? (
                        <p className="text-muted-foreground">No pending approvals.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingOrganizers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => handleApprove(user.id)}>Approve</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
