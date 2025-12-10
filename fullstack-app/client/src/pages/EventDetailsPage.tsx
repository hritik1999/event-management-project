import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Calendar, MapPin, ArrowLeft, Star, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface TicketType {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: { username: string };
    createdAt: string;
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
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState("");

    const fetchEvent = async () => {
        try {
            const { data } = await api.get(`/events/${id}`);
            setEvent(data);
            if (data.ticketTypes.length > 0) {
                // If it's a new load or no ticket selected, set default
                if (!selectedTicket) setSelectedTicket(data.ticketTypes[0].id);
            }
        } catch (error) {
            toast.error("Failed to load event details");
            navigate("/events");
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await api.get(`/reviews/event/${id}`);
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews");
        }
    };

    useEffect(() => {
        fetchEvent();
        fetchReviews();
    }, [id, navigate]);

    const handleBooking = () => {
        if (!user) {
            toast.error("Please login to book tickets");
            navigate("/login");
            return;
        }

        setIsBookingDialogOpen(true);
    };

    const confirmBooking = async () => {
        try {
            await api.post("/bookings", { ticketTypeId: selectedTicket });
            setIsBookingDialogOpen(false);
            toast.success("Booking confirmed!");
            navigate("/my-bookings");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to verify your attendance and review");
            return;
        }
        try {
            await api.post("/reviews", { eventId: id, rating, comment });
            toast.success("Review submitted!");
            setComment("");
            setRating(5);
            fetchReviews();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    };

    if (!event) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-background relative">
            {/* Hero Banner Background */}
            <div className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden -z-10">
                {event.bannerImage ? (
                    <>
                        <img src={event.bannerImage} alt="" className="w-full h-full object-cover blur-sm opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-primary/20 to-background" />
                )}
            </div>

            <div className="container mx-auto py-8 px-4 pt-32">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 hover:bg-background/20 text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Header */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">{event.title}</h1>
                            <div className="flex flex-wrap gap-6 text-lg text-muted-foreground">
                                <div className="flex items-center bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="flex items-center bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        {/* Banner Image (Main) */}
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                            {event.bannerImage ? (
                                <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-1 h-8 bg-primary rounded-full"></span>
                                About this event
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{event.description}</p>
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-8 border-t border-border/50">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Star className="text-yellow-500 fill-yellow-500 h-6 w-6" />
                                Reviews
                            </h3>

                            {/* Review Form */}
                            {user && user.role === "ATTENDEE" && (
                                <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Share your experience</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Rating</Label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Button
                                                            key={star}
                                                            type="button"
                                                            variant={rating >= star ? "default" : "outline"}
                                                            size="icon"
                                                            className="h-10 w-10 transition-all hover:scale-110"
                                                            onClick={() => setRating(star)}
                                                        >
                                                            <Star className={`h-5 w-5 ${rating >= star ? "fill-current" : ""}`} />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="comment">Comment</Label>
                                                <Textarea
                                                    id="comment"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="What did you like about the event?"
                                                    className="bg-background/50"
                                                    required
                                                />
                                            </div>
                                            <Button type="submit">Submit Review</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <Card key={review.id} className="border-border/50 bg-card/30">
                                            <CardContent className="pt-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                            <User className="h-4 w-4" />
                                                        </div>
                                                        {review.user.username}
                                                    </div>
                                                    <div className="flex text-yellow-500">
                                                        {Array.from({ length: review.rating }).map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground mt-2">{review.comment}</p>
                                                <div className="text-xs text-muted-foreground/50 mt-4">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                            <CardHeader>
                                <CardTitle>Book Tickets</CardTitle>
                                <CardDescription>Secure your spot now</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Select Ticket</Label>
                                    <Select value={selectedTicket} onValueChange={setSelectedTicket}>
                                        <SelectTrigger className="h-12 border-primary/20 bg-background/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {event.ticketTypes.map((ticket) => (
                                                <SelectItem key={ticket.id} value={ticket.id}>
                                                    <div className="flex justify-between w-full gap-4">
                                                        <span>{ticket.name}</span>
                                                        <span className="font-bold">${ticket.price}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Ticket Price</span>
                                        <span>${event.ticketTypes.find(t => t.id === selectedTicket)?.price || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Fees</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="border-t border-border/50 my-2"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            ${event.ticketTypes.find(t => t.id === selectedTicket)?.price || 0}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20" onClick={handleBooking} disabled={!selectedTicket}>
                                    Book Ticket
                                </Button>

                                <div className="text-center text-xs text-muted-foreground mt-4">
                                    Event organized by <span className="font-medium text-foreground">{event.organizer.username}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogDescription>
                            Please review your booking details before proceeding via payment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">Event</span>
                            <span className="font-semibold">{event.title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">Ticket Type</span>
                            <span>{event.ticketTypes.find(t => t.id === selectedTicket)?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-4 border-t border-border">
                            <span className="font-bold">Total Amount</span>
                            <span className="font-bold text-primary text-xl">
                                ${event.ticketTypes.find(t => t.id === selectedTicket)?.price}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmBooking} className="w-full sm:w-auto">
                            Pay & Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
