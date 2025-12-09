import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./User"
import { Event } from "./Event"

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("int")
    rating!: number // 1-5

    @Column("text")
    comment!: string

    @ManyToOne(() => User, (user) => user.reviews)
    user!: User

    @ManyToOne(() => Event, (event) => event.reviews, { onDelete: 'CASCADE' })
    event!: Event

    @CreateDateColumn()
    createdAt!: Date
}
