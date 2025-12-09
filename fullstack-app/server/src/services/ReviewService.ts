import { AppDataSource } from "../data-source"
import { Review } from "../entities/Review"
import { Event } from "../entities/Event"
import { User } from "../entities/User"

export class ReviewService {
    private reviewRepository = AppDataSource.getRepository(Review)

    async createReview(data: Partial<Review>, userId: string, eventId: string) {
        if (!data.rating || data.rating < 1 || data.rating > 5) {
            throw new Error("Rating must be between 1 and 5")
        }

        const review = this.reviewRepository.create({
            ...data,
            user: { id: userId } as User,
            event: { id: eventId } as Event
        })

        return await this.reviewRepository.save(review)
    }

    async getReviewsByEvent(eventId: string) {
        return await this.reviewRepository.find({
            where: { event: { id: eventId } },
            relations: ["user"],
            order: { createdAt: "DESC" }
        })
    }
}
