import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { Plus, Calendar, MapPin, Edit, Ticket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface TicketType {
    name: string;
    price: number;
    quantity: number;
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    organizer: { id: string; username: string };
    ticketTypes: TicketType[];
}

export function OrganizerDashboard() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "Tech",
        bannerImage: ""
    });

    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
        { name: "General", price: 0, quantity: 100 }
    ]);

    const [searchParams] = useSearchParams();

    const fetchMyEvents = async () => {
        if (!user) return;
        try {
            const { data } = await api.get(`/events?organizerId=${user.id}`);
            setEvents(data);
        } catch (error) {
            toast.error("Failed to fetch events");
        }
    };

    useEffect(() => {
        fetchMyEvents();
        if (searchParams.get("action") === "create") {
            openCreateDialog();
        }
    }, [user, searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, category: value });
    };

    const handleTicketChange = (index: number, field: keyof TicketType, value: any) => {
        const newTickets = [...ticketTypes];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTicketTypes(newTickets);
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: "VIP", price: 50, quantity: 20 }]);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            category: "Tech",
            bannerImage: ""
        });
        setTicketTypes([{ name: "General", price: 0, quantity: 100 }]);
        setEditingEventId(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (event: Event) => {
        const dateObj = new Date(event.date);
        const dateStr = dateObj.toISOString().split("T")[0];
        const timeStr = dateObj.toTimeString().split(" ")[0].substring(0, 5);

        setFormData({
            title: event.title,
            description: event.description,
            date: dateStr,
            time: timeStr,
            location: event.location,
            category: event.category,
            bannerImage: "" // Assuming we don't edit banner yet or it's separate
        });
        setTicketTypes(event.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes : [{ name: "General", price: 0, quantity: 100 }]);
        setEditingEventId(event.id);
        setIsDialogOpen(true);
    };

    const [stats, setStats] = useState<any>(null);

    // ... (existing state)

    const fetchStats = async () => {
        try {
            const { data } = await api.get("/events/stats/organizer");
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    useEffect(() => {
        fetchMyEvents();
        fetchStats();
        if (searchParams.get("action") === "create") {
            openCreateDialog();
        }
    }, [user, searchParams]);

    // ... (existing handlers)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const currentDateTime = new Date();
        const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

        if (selectedDateTime <= currentDateTime) {
            toast.error("Event date and time must be in the future.");
            return;
        }

        if (ticketTypes.length === 0) {
            toast.error("Please add at least one ticket type.");
            return;
        }

        for (const ticket of ticketTypes) {
            if (!ticket.name) {
                toast.error("All ticket types must have a name.");
                return;
            }
            if (ticket.price < 0) {
                toast.error(`Price for ticket '${ticket.name}' cannot be negative.`);
                return;
            }
            if (ticket.quantity <= 0) {
                toast.error(`Quantity for ticket '${ticket.name}' must be greater than zero.`);
                return;
            }
        }

        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const payload = {
                ...formData,
                date: dateTime.toISOString(),
                ticketTypes
            };

            if (editingEventId) {
                await api.put(`/events/${editingEventId}`, payload);
                toast.success("Event updated successfully");
            } else {
                await api.post("/events", payload);
                toast.success("Event created successfully");
            }

            setIsDialogOpen(false);
            resetForm();
            fetchMyEvents();
            fetchStats(); // Refresh stats after change
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save event");
        }
    };

    return (
        <div className="container mx-auto py-8 min-h-[calc(100vh-4rem)]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Organizer Dashboard</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" /> Create Event</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingEventId ? "Edit Event" : "Create New Event"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input id="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={handleSelectChange} defaultValue={formData.category} value={formData.category}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tech">Tech</SelectItem>
                                            <SelectItem value="Music">Music</SelectItem>
                                            <SelectItem value="Sports">Sports</SelectItem>
                                            <SelectItem value="Workshop">Workshop</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={formData.description} onChange={handleInputChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input id="time" type="time" value={formData.time} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={formData.location} onChange={handleInputChange} required />
                            </div>

                            <div className="space-y-4 border p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Ticket Types</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addTicketType}>Add Ticket Type</Button>
                                </div>
                                {ticketTypes.map((ticket, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-2 items-end">
                                        <div className="space-y-1">
                                            <Label>Name</Label>
                                            <Input value={ticket.name} onChange={(e) => handleTicketChange(index, "name", e.target.value)} required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Price</Label>
                                            <Input type="number" min="0" value={ticket.price} onChange={(e) => handleTicketChange(index, "price", parseFloat(e.target.value))} required />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Quantity</Label>
                                            <Input type="number" min="1" value={ticket.quantity} onChange={(e) => handleTicketChange(index, "quantity", parseInt(e.target.value))} required />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" className="w-full">{editingEventId ? "Update Event" : "Create Event"}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {stats && (
                <div className="space-y-8 mb-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Total Events", icon: Calendar, value: stats.totalEvents },
                            { title: "Tickets Sold", icon: Ticket, value: stats.totalTicketsSold },
                            { title: "Total Revenue", icon: null, value: `$${(stats.totalRevenue || 0).toFixed(2)}`, isMoney: true },
                            { title: "Avg. Revenue/Event", icon: null, value: `$${(stats.totalEvents > 0 ? stats.totalRevenue / stats.totalEvents : 0).toFixed(2)}`, isMoney: true }
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="col-span-1 border-border/50 shadow-xl shadow-primary/5">
                            <CardHeader>
                                <CardTitle>Sales Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.revenueTrend || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'oklch(var(--card))', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                cursor={{ fill: 'oklch(var(--muted)/0.5)' }}
                                            />
                                            <Bar dataKey="value" fill="oklch(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue ($)" />
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
                                                {(stats.eventsByCategory || []).map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: 'oklch(var(--card))', borderRadius: '8px', border: 'none' }} />
                                            <Legend iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                        <CardHeader className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge variant="secondary" className="mb-2">{event.category}</Badge>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => openEditDialog(event)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm text-balance">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4 text-primary/70" />
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 text-primary/70" />
                                    {event.location}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-border/50 pt-4 bg-muted/20 relative z-10">
                            <span className="text-sm font-semibold text-primary">
                                {event.ticketTypes?.reduce((acc, curr) => acc + curr.quantity, 0)} Seats
                            </span>
                            <div className="text-sm text-muted-foreground">
                                {event.ticketTypes?.length} Ticket Types
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {events.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border/50 border-dashed">
                    <p className="text-muted-foreground mb-4 text-lg">You haven't created any events yet.</p>
                    <Button onClick={openCreateDialog} variant="outline" className="border-primary/50 text-primary hover:bg-primary/5">Create Your First Event</Button>
                </div>
            )}
        </div>
    );
}
