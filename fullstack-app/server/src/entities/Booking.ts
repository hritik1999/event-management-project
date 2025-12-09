import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./User"
import { TicketType } from "./TicketType"

export enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => User, (user) => user.bookings)
    user!: User

    @ManyToOne(() => TicketType, (ticketType) => ticketType.bookings)
    ticketType!: TicketType

    @Column({
        type: "enum",
        enum: BookingStatus,
        default: BookingStatus.CONFIRMED
    })
    status!: BookingStatus

    @CreateDateColumn()
    bookingDate!: Date
}
