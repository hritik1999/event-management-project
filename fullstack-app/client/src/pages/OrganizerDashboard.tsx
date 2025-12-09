import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { Plus, Calendar, MapPin } from "lucide-react";

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
    const [isCreateOpen, setIsCreateOpen] = useState(false);

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
    }, [user]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const payload = {
                ...formData,
                date: dateTime.toISOString(),
                ticketTypes
            };

            await api.post("/events", payload);
            toast.success("Event created successfully");
            setIsCreateOpen(false);
            fetchMyEvents();
            // Reset form
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
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create event");
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Organizer Dashboard</h1>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Create Event</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input id="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={handleSelectChange} defaultValue={formData.category}>
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

                            <Button type="submit" className="w-full">Create Event</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>{event.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-slate-500">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-slate-500">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {event.location}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <span className="text-sm font-medium">
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
                <div className="text-center py-12 text-muted-foreground">
                    You haven't created any events yet.
                </div>
            )}
        </div>
    );
}
