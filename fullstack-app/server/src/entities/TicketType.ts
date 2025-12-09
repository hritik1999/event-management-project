import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Event } from "./Event"
import { Booking } from "./Booking"

@Entity()
export class TicketType {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    name!: string // e.g. VIP, Regular

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number

    @Column("int")
    quantity!: number // Total seats available for this type

    @ManyToOne(() => Event, (event) => event.ticketTypes, { onDelete: 'CASCADE' })
    event!: Event

    @OneToMany(() => Booking, (booking) => booking.ticketType)
    bookings!: Booking[]
}
