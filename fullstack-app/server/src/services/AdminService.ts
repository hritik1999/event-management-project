import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { Event } from "../entities/Event";
import { Booking } from "../entities/Booking";

export class AdminService {
    private userRepository = AppDataSource.getRepository(User);
    private eventRepository = AppDataSource.getRepository(Event);
    private bookingRepository = AppDataSource.getRepository(Booking);

    async getStats() {
        const totalUsers = await this.userRepository.count();
        const totalOrganizers = await this.userRepository.count({ where: { role: UserRole.ORGANIZER } });
        const totalAttendees = await this.userRepository.count({ where: { role: UserRole.ATTENDEE } });
        const totalEvents = await this.eventRepository.count();
        const totalBookings = await this.bookingRepository.count();

        // Aggregation: Events by Category
        const eventsByCategory = await this.eventRepository
            .createQueryBuilder("event")
            .select("event.category", "name")
            .addSelect("COUNT(event.id)", "value")
            .groupBy("event.category")
            .getRawMany();

        // Aggregation: Bookings over time (last 6 months) - simplified for demo
        // In a real app we would use SQL date truncation. Here we fetch recent bookings and process in JS for simplicity/database agnostic.
        const recentBookings = await this.bookingRepository.find({
            order: { bookingDate: "DESC" },
            take: 100 // Sample size for demo, or fetch all if volume is low.
        });

        // Group bookings by month
        const bookingsByMonth: Record<string, number> = {};
        recentBookings.forEach(booking => {
            const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
            bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
        });

        const bookingsTrend = Object.keys(bookingsByMonth).map(name => ({
            name,
            bookings: bookingsByMonth[name]
        }));

        // Aggregation: Total Revenue (Sum of ticket prices for confirmed bookings)
        const totalRevenueResult = await this.bookingRepository
            .createQueryBuilder("booking")
            .leftJoin("booking.ticketType", "ticketType")
            .select("SUM(ticketType.price)", "total")
            .where("booking.status = :status", { status: "CONFIRMED" })
            .getRawOne();

        const totalRevenue = parseFloat(totalRevenueResult?.total || "0");

        // Aggregation: Revenue per Organizer
        const revenueByOrganizer = await this.bookingRepository
            .createQueryBuilder("booking")
            .leftJoin("booking.ticketType", "ticketType")
            .leftJoin("ticketType.event", "event")
            .leftJoin("event.organizer", "organizer")
            .select("organizer.username", "name")
            .addSelect("SUM(ticketType.price)", "value")
            .where("booking.status = :status", { status: "CONFIRMED" })
            .groupBy("organizer.username")
            .getRawMany();

        return {
            totalUsers,
            totalOrganizers,
            totalAttendees,
            totalEvents,
            totalBookings,
            eventsByCategory: eventsByCategory.map(e => ({ name: e.name, value: parseInt(e.value) })),
            bookingsTrend,
            totalRevenue,
            revenueByOrganizer: revenueByOrganizer.map(r => ({ name: r.name, value: parseFloat(r.value) }))
        };
    }
}
