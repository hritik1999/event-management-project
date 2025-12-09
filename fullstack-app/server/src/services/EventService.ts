import { AppDataSource } from "../data-source"
import { Event } from "../entities/Event"
import { TicketType } from "../entities/TicketType"
import { User } from "../entities/User"
import { Booking } from "../entities/Booking"

export class EventService {
    private eventRepository = AppDataSource.getRepository(Event)
    private ticketTypeRepository = AppDataSource.getRepository(TicketType)
    private bookingRepository = AppDataSource.getRepository(Booking) // Added Booking repo

    async getOrganizerStats(organizerId: string) {
        const totalEvents = await this.eventRepository.count({ where: { organizer: { id: organizerId } } });

        // Total Tickets Sold (Bookings for events by this organizer)
        const totalTicketsSold = await this.bookingRepository
            .createQueryBuilder("booking")
            .leftJoin("booking.ticketType", "ticketType")
            .leftJoin("ticketType.event", "event")
            .where("event.organizerId = :organizerId", { organizerId })
            .andWhere("booking.status = :status", { status: "CONFIRMED" })
            .getCount();

        // Total Revenue
        const totalRevenueResult = await this.bookingRepository
            .createQueryBuilder("booking")
            .leftJoin("booking.ticketType", "ticketType")
            .leftJoin("ticketType.event", "event")
            .select("SUM(ticketType.price)", "total")
            .where("event.organizerId = :organizerId", { organizerId })
            .andWhere("booking.status = :status", { status: "CONFIRMED" })
            .getRawOne();
        const totalRevenue = parseFloat(totalRevenueResult?.total || "0");

        // Recent Sales Trend (Last 6 months)
        const recentBookings = await this.bookingRepository
            .createQueryBuilder("booking")
            .leftJoinAndSelect("booking.ticketType", "ticketType")
            .leftJoin("ticketType.event", "event")
            .where("event.organizerId = :organizerId", { organizerId })
            .orderBy("booking.bookingDate", "DESC")
            .take(100)
            .getMany();

        const salesByMonth: Record<string, number> = {};
        recentBookings.forEach(booking => {
            const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
            salesByMonth[month] = (salesByMonth[month] || 0) + booking.ticketType.price;
        });

        const revenueTrend = Object.keys(salesByMonth).map(name => ({
            name,
            value: salesByMonth[name]
        }));

        // Events by Category (for this organizer)
        const eventsByCategory = await this.eventRepository
            .createQueryBuilder("event")
            .select("event.category", "name")
            .addSelect("COUNT(event.id)", "value")
            .where("event.organizerId = :organizerId", { organizerId })
            .groupBy("event.category")
            .getRawMany();

        return {
            totalEvents,
            totalTicketsSold,
            totalRevenue,
            revenueTrend,
            eventsByCategory: eventsByCategory.map(e => ({ name: e.name, value: parseInt(e.value) }))
        };
    }

    async createEvent(data: Partial<Event>, userId: string, ticketTypesData?: Partial<TicketType>[]) {
        const event = this.eventRepository.create({
            ...data,
            organizer: { id: userId } as User
        })

        const savedEvent = await this.eventRepository.save(event)

        if (ticketTypesData && ticketTypesData.length > 0) {
            const ticketTypes = ticketTypesData.map(tt => this.ticketTypeRepository.create({
                ...tt,
                event: savedEvent
            }))
            await this.ticketTypeRepository.save(ticketTypes)
            savedEvent.ticketTypes = ticketTypes
        }

        return savedEvent
    }

    async getAllEvents(filters?: any) {
        // Basic filtering can be expanded
        const query = this.eventRepository.createQueryBuilder("event")
            .leftJoinAndSelect("event.organizer", "organizer")
            .leftJoinAndSelect("event.ticketTypes", "ticketTypes")
            .orderBy("event.date", "ASC")

        if (filters?.category) {
            query.andWhere("event.category = :category", { category: filters.category })
        }

        if (filters?.search) {
            query.andWhere("(event.title ILIKE :search OR event.description ILIKE :search)", { search: `%${filters.search}%` })
        }

        if (filters?.organizerId) {
            query.andWhere("organizer.id = :organizerId", { organizerId: filters.organizerId })
        }

        return await query.getMany()
    }

    async getEventById(id: string) {
        return await this.eventRepository.findOne({
            where: { id },
            relations: ["organizer", "ticketTypes", "reviews", "reviews.user"]
        })
    }

    async updateEvent(id: string, userId: string, data: Partial<Event>) {
        const event = await this.eventRepository.findOne({ where: { id }, relations: ["organizer"] })
        if (!event) throw new Error("Event not found")

        if (event.organizer.id !== userId) { // Simple check, in real app consider admin override
            throw new Error("Unauthorized")
        }

        Object.assign(event, data)
        return await this.eventRepository.save(event)
    }

    async deleteEvent(id: string, userId: string) {
        const event = await this.eventRepository.findOne({ where: { id }, relations: ["organizer"] })
        if (!event) throw new Error("Event not found")

        if (event.organizer.id !== userId) {
            throw new Error("Unauthorized")
        }

        return await this.eventRepository.remove(event)
    }
}
