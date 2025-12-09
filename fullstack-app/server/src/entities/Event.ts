import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { TicketType } from "./TicketType"
import { Review } from "./Review"

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    title!: string

    @Column("text")
    description!: string

    @Column()
    date!: Date

    @Column()
    location!: string

    @Column()
    category!: string

    @Column({ nullable: true })
    bannerImage!: string

    @ManyToOne(() => User, (user) => user.events)
    organizer!: User

    @OneToMany(() => TicketType, (ticketType) => ticketType.event)
    ticketTypes!: TicketType[]

    @OneToMany(() => Review, (review) => review.event)
    reviews!: Review[]

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
