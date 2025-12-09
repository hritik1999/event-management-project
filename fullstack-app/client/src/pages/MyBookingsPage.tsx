import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface Booking {
    id: string;
    status: string;
    bookingDate: string;
    ticketType: {
        name: string;
        price: number;
        event: {
            title: string;
            date: string;
            location: string;
            bannerImage: string;
        };
    };
}

export function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get("/bookings/my-bookings");
                setBookings(data);
            } catch (error) {
                toast.error("Failed to fetch bookings");
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="flex flex-row overflow-hidden">
                        <div className="w-1/3 bg-slate-200 relative">
                            {booking.ticketType.event.bannerImage ? (
                                <img src={booking.ticketType.event.bannerImage} alt="Event" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">No Image</div>
                            )}
                        </div>
                        <div className="w-2/3">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{booking.ticketType.event.title}</CardTitle>
                                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "destructive"}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(booking.ticketType.event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {booking.ticketType.event.location}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <div className="flex items-center font-medium">
                                        <Ticket className="mr-2 h-4 w-4" />
                                        {booking.ticketType.name}
                                    </div>
                                    <div className="font-bold">
                                        ${booking.ticketType.price}
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                    Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
            {bookings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    You haven't booked any events yet.
                </div>
            )}
        </div>
    );
}
