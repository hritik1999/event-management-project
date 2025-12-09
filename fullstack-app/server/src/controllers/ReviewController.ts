import { Response } from "express"
import { ReviewService } from "../services/ReviewService"
import { AuthRequest } from "../middlewares/auth.middleware"

const reviewService = new ReviewService()

export class ReviewController {
    static async createReview(req: AuthRequest, res: Response) {
        try {
            const { eventId, rating, comment } = req.body
            const review = await reviewService.createReview({ rating, comment }, req.user!.userId, eventId)
            res.status(201).json(review)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }

    static async getReviewsByEvent(req: AuthRequest, res: Response) {
        try {
            const reviews = await reviewService.getReviewsByEvent(req.params.eventId)
            res.status(200).json(reviews)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
}
