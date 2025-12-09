import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { Calendar, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    bannerImage: string;
}

export function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const fetchEvents = async () => {
        try {
            const params: any = {};
            if (search) params.search = search;
            if (category && category !== "All") params.category = category;

            const { data } = await api.get("/events", { params });
            setEvents(data);
        } catch (error) {
            toast.error("Failed to fetch events");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [category]); // Search triggered on enter or button click

    return (
        <div className="container mx-auto py-12 px-4 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Explore Events</h1>
                    <p className="text-muted-foreground">Discover and book the best experiences around you.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-card/60 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search events..."
                            className="pl-9 bg-background/50 border-transparent focus:border-primary/20 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
                        />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full sm:w-[160px] bg-background/50 border-transparent focus:border-primary/20 rounded-xl">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Tech">Tech</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={fetchEvents} className="rounded-xl shadow-md">Search</Button>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group flex flex-col h-full rounded-2xl">
                        <div className="aspect-video w-full bg-muted relative overflow-hidden">
                            {/* Placeholder for banner image */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20">
                                No Image
                            </div>
                            {event.bannerImage && (
                                <img
                                    src={event.bannerImage}
                                    alt={event.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            )}
                            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {event.category}
                            </div>
                        </div>
                        <CardHeader className="flex-none pb-2">
                            <CardTitle className="mb-1 text-xl line-clamp-1 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4 text-primary/60" />
                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 text-primary/60" />
                                    {event.location}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-none pt-0 pb-6 px-6">
                            <Link to={`/events/${event.id}`} className="w-full">
                                <Button className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">View Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {events.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-muted-foreground text-lg mb-4">No events found matching your criteria.</div>
                    <Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>Clear Filters</Button>
                </div>
            )}
        </div>
    );
}
