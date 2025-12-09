import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
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
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Upcoming Events</h1>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search events..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
                        />
                    </div>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Tech">Tech</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={fetchEvents}>Filter</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video w-full bg-slate-200 relative">
                            {/* Placeholder for banner image */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                No Image
                            </div>
                            {event.bannerImage && <img src={event.bannerImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />}
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="mb-1">{event.title}</CardTitle>
                                    <CardDescription>{event.category}</CardDescription>
                                </div>
                            </div>
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
                        <CardFooter>
                            <Link to={`/events/${event.id}`} className="w-full">
                                <Button className="w-full">View Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {events.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No events found matching your criteria.
                </div>
            )}
        </div>
    );
}
