import { Router } from "express"
import { ReviewController } from "../controllers/ReviewController"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.post("/", authenticate, ReviewController.createReview)
router.get("/event/:eventId", ReviewController.getReviewsByEvent)

export default router
