
import { AppDataSource } from "../data-source";
import { AdminService } from "../services/AdminService";
import { Booking } from "../entities/Booking";
import { TicketType } from "../entities/TicketType";

async function main() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const adminService = new AdminService();
        const stats = await adminService.getStats();

        console.log("---------------------------------------------------");
        console.log("Admin Stats Output:");
        console.log(JSON.stringify(stats, null, 2));
        console.log("---------------------------------------------------");

        const bookingRepo = AppDataSource.getRepository(Booking);
        const allBookings = await bookingRepo.find({
            relations: ["ticketType", "ticketType.event", "ticketType.event.organizer"]
        });

        console.log("Raw Bookings Count:", allBookings.length);
        allBookings.forEach((b, i) => {
            console.log(`Booking ${i + 1}: ID=${b.id}, Status=${b.status}, Price=${b.ticketType?.price}, Date=${b.bookingDate}`);
        });

        const ticketTypes = await AppDataSource.getRepository(TicketType).find();
        console.log("Raw TicketTypes Count:", ticketTypes.length);

    } catch (err) {
        console.error("Error during Data Source initialization", err);
    } finally {
        await AppDataSource.destroy();
    }
}

main();
