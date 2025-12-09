import { Response } from "express"
import { AppDataSource } from "../data-source"
import { Booking, BookingStatus } from "../entities/Booking"
import { TicketType } from "../entities/TicketType"
import { AuthRequest } from "../middlewares/auth.middleware"

export class BookingController {
    static async createBooking(req: AuthRequest, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const { ticketTypeId } = req.body
            const userId = req.user.userId

            const ticketType = await queryRunner.manager.findOne(TicketType, {
                where: { id: ticketTypeId },
                relations: ["bookings"]
            })

            if (!ticketType) {
                console.log("Ticket type not found: " + ticketTypeId)
                throw new Error("Ticket type not found")
            }

            // Check availability - Simple count check
            // In a real high-concurrency app, we'd need better locking or atomic updates
            const currentBookings = await queryRunner.manager.count(Booking, {
                where: { ticketType: { id: ticketTypeId }, status: BookingStatus.CONFIRMED }
            })

            if (currentBookings >= ticketType.quantity) {
                console.log("Sold out")
                throw new Error("Tickets sold out")
            }

            const booking = queryRunner.manager.create(Booking, {
                user: { id: userId },
                ticketType: { id: ticketTypeId },
                status: BookingStatus.CONFIRMED
            })

            await queryRunner.manager.save(booking)
            await queryRunner.commitTransaction()

            res.status(201).json(booking)
        } catch (error: any) {
            console.log("Booking error: " + error)
            await queryRunner.rollbackTransaction()
            res.status(400).json({ message: error.message })
        } finally {
            await queryRunner.release()
        }
    }

    static async getMyBookings(req: AuthRequest, res: Response) {
        const bookingRepo = AppDataSource.getRepository(Booking)
        const bookings = await bookingRepo.find({
            where: { user: { id: req.user.userId } },
            relations: ["ticketType", "ticketType.event"]
        })
        res.status(200).json(bookings)
    }
}
