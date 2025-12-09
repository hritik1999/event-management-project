import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-blue-50 to-white">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                    Manage Events <span className="text-blue-600">Effortlessly</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
                    The ultimate platform for organizers to create memorable experiences and for attendees to discover them.
                </p>
                <div className="flex gap-4">
                    <Link to="/register">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link to="/events">
                        <Button size="lg" variant="outline">Browse Events</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
