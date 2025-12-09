import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Event } from "./Event"
import { Booking } from "./Booking"
import { Review } from "./Review"

export enum UserRole {
    ADMIN = "ADMIN",
    ORGANIZER = "ORGANIZER",
    ATTENDEE = "ATTENDEE"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ unique: true })
    username!: string

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.ATTENDEE
    })
    role!: UserRole

    @Column({ default: true }) // Default true for Attendees/Admins, logic will handle Organizer approval
    isApproved!: boolean

    @OneToMany(() => Event, (event) => event.organizer)
    events!: Event[]

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings!: Booking[]

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[]

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
