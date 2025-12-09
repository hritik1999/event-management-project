import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface TicketType {
    id: string;
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
    bannerImage: string;
    ticketTypes: TicketType[];
    organizer: { username: string };
}
export function EventDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<string>("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
                if (data.ticketTypes.length > 0) {
                    setSelectedTicket(data.ticketTypes[0].id);
                }
            } catch (error) {
                toast.error("Failed to load event details");
                navigate("/events");
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleBooking = async () => {
        if (!user) {
            toast.error("Please login to book tickets");
            navigate("/login");
            return;
        }

        try {
            await api.post("/bookings", { ticketTypeId: selectedTicket });
            toast.success("Booking confirmed!");
            navigate("/my-bookings");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    if (!event) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="container mx-auto py-8 px-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="aspect-video w-full bg-slate-200 rounded-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            No Image
                        </div>
                        {event.bannerImage && <img src={event.bannerImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                        <div className="flex gap-4 text-slate-600 mb-4">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                {event.location}
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-2">About this event</h3>
                            <p className="whitespace-pre-wrap text-slate-700">{event.description}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Book Tickets</CardTitle>
                            <CardDescription>Select a ticket type to reserve your spot.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Ticket Type</Label>
                                <Select value={selectedTicket} onValueChange={setSelectedTicket}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {event.ticketTypes.map((ticket) => (
                                            <SelectItem key={ticket.id} value={ticket.id}>
                                                {ticket.name} - ${ticket.price}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between mb-4 font-semibold">
                                    <span>Total</span>
                                    <span>
                                        ${event.ticketTypes.find(t => t.id === selectedTicket)?.price || 0}
                                    </span>
                                </div>
                                <Button className="w-full" onClick={handleBooking} disabled={!selectedTicket}>
                                    Book Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4 text-center text-sm text-slate-500">
                        Event organized by {event.organizer.username}
                    </div>
                </div>
            </div>
        </div>
    );
}
