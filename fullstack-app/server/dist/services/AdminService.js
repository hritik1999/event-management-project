"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const Event_1 = require("../entities/Event");
const Booking_1 = require("../entities/Booking");
class AdminService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        this.eventRepository = data_source_1.AppDataSource.getRepository(Event_1.Event);
        this.bookingRepository = data_source_1.AppDataSource.getRepository(Booking_1.Booking);
    }
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield this.userRepository.count();
            const totalOrganizers = yield this.userRepository.count({ where: { role: User_1.UserRole.ORGANIZER } });
            const totalAttendees = yield this.userRepository.count({ where: { role: User_1.UserRole.ATTENDEE } });
            const totalEvents = yield this.eventRepository.count();
            const totalBookings = yield this.bookingRepository.count();
            // Aggregation: Events by Category
            const eventsByCategory = yield this.eventRepository
                .createQueryBuilder("event")
                .select("event.category", "name")
                .addSelect("COUNT(event.id)", "value")
                .groupBy("event.category")
                .getRawMany();
            // Aggregation: Bookings over time (last 6 months) - simplified for demo
            // In a real app we would use SQL date truncation. Here we fetch recent bookings and process in JS for simplicity/database agnostic.
            const recentBookings = yield this.bookingRepository.find({
                order: { bookingDate: "DESC" },
                take: 100 // Sample size for demo, or fetch all if volume is low.
            });
            // Group bookings by month
            const bookingsByMonth = {};
            recentBookings.forEach(booking => {
                const month = new Date(booking.bookingDate).toLocaleString('default', { month: 'short' });
                bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
            });
            const bookingsTrend = Object.keys(bookingsByMonth).map(name => ({
                name,
                bookings: bookingsByMonth[name]
            }));
            // Aggregation: Total Revenue (Sum of ticket prices for confirmed bookings)
            const totalRevenueResult = yield this.bookingRepository
                .createQueryBuilder("booking")
                .leftJoin("booking.ticketType", "ticketType")
                .select("SUM(ticketType.price)", "total")
                .where("booking.status = :status", { status: "CONFIRMED" })
                .getRawOne();
            const totalRevenue = parseFloat((totalRevenueResult === null || totalRevenueResult === void 0 ? void 0 : totalRevenueResult.total) || "0");
            // Aggregation: Revenue per Organizer
            const revenueByOrganizer = yield this.bookingRepository
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
        });
    }
}
exports.AdminService = AdminService;
