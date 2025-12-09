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
exports.BookingController = void 0;
const data_source_1 = require("../data-source");
const Booking_1 = require("../entities/Booking");
const TicketType_1 = require("../entities/TicketType");
class BookingController {
    static createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const { ticketTypeId } = req.body;
                const userId = req.user.userId;
                const ticketType = yield queryRunner.manager.findOne(TicketType_1.TicketType, {
                    where: { id: ticketTypeId },
                    relations: ["bookings"]
                });
                if (!ticketType) {
                    console.log("Ticket type not found: " + ticketTypeId);
                    throw new Error("Ticket type not found");
                }
                // Check availability - Simple count check
                // In a real high-concurrency app, we'd need better locking or atomic updates
                const currentBookings = yield queryRunner.manager.count(Booking_1.Booking, {
                    where: { ticketType: { id: ticketTypeId }, status: Booking_1.BookingStatus.CONFIRMED }
                });
                if (currentBookings >= ticketType.quantity) {
                    console.log("Sold out");
                    throw new Error("Tickets sold out");
                }
                const booking = queryRunner.manager.create(Booking_1.Booking, {
                    user: { id: userId },
                    ticketType: { id: ticketTypeId },
                    status: Booking_1.BookingStatus.CONFIRMED
                });
                yield queryRunner.manager.save(booking);
                yield queryRunner.commitTransaction();
                res.status(201).json(booking);
            }
            catch (error) {
                console.log("Booking error: " + error);
                yield queryRunner.rollbackTransaction();
                res.status(400).json({ message: error.message });
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static getMyBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingRepo = data_source_1.AppDataSource.getRepository(Booking_1.Booking);
            const bookings = yield bookingRepo.find({
                where: { user: { id: req.user.userId } },
                relations: ["ticketType", "ticketType.event"]
            });
            res.status(200).json(bookings);
        });
    }
}
exports.BookingController = BookingController;
