import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-background -z-20"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

                <div className="space-y-6 max-w-4xl z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                        Design. Manage. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Experience.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        The next-generation platform for crafting unforgettable events and discovering your next adventure.
                    </p>
                    <div className="flex gap-4 justify-center mt-8">
                        <Link to="/register">
                            <Button size="lg" className="px-8 text-lg h-12 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">Get Started</Button>
                        </Link>
                        <Link to="/events">
                            <Button size="lg" variant="outline" className="px-8 text-lg h-12 rounded-full border-2 hover:bg-muted transition-all">Browse Events</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
