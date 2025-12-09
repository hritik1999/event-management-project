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
const data_source_1 = require("../data-source");
const AdminService_1 = require("../services/AdminService");
const Booking_1 = require("../entities/Booking");
const TicketType_1 = require("../entities/TicketType");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield data_source_1.AppDataSource.initialize();
            console.log("Data Source has been initialized!");
            const adminService = new AdminService_1.AdminService();
            const stats = yield adminService.getStats();
            console.log("---------------------------------------------------");
            console.log("Admin Stats Output:");
            console.log(JSON.stringify(stats, null, 2));
            console.log("---------------------------------------------------");
            const bookingRepo = data_source_1.AppDataSource.getRepository(Booking_1.Booking);
            const allBookings = yield bookingRepo.find({
                relations: ["ticketType", "ticketType.event", "ticketType.event.organizer"]
            });
            console.log("Raw Bookings Count:", allBookings.length);
            allBookings.forEach((b, i) => {
                var _a;
                console.log(`Booking ${i + 1}: ID=${b.id}, Status=${b.status}, Price=${(_a = b.ticketType) === null || _a === void 0 ? void 0 : _a.price}, Date=${b.bookingDate}`);
            });
            const ticketTypes = yield data_source_1.AppDataSource.getRepository(TicketType_1.TicketType).find();
            console.log("Raw TicketTypes Count:", ticketTypes.length);
        }
        catch (err) {
            console.error("Error during Data Source initialization", err);
        }
        finally {
            yield data_source_1.AppDataSource.destroy();
        }
    });
}
main();
