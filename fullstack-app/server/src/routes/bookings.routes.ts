import { Router } from "express"
import { BookingController } from "../controllers/BookingController"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

router.post("/", authenticate, BookingController.createBooking)
router.get("/my-bookings", authenticate, BookingController.getMyBookings)

export default router
