import { Router } from "express"
import { EventController } from "../controllers/EventController"
import { authenticate, authorize } from "../middlewares/auth.middleware"
import { UserRole } from "../entities/User"

const router = Router()

router.get("/", EventController.getAllEvents)
router.get("/:id", EventController.getEventById)

router.post("/", authenticate, authorize([UserRole.ORGANIZER, UserRole.ADMIN]), EventController.createEvent)
router.put("/:id", authenticate, authorize([UserRole.ORGANIZER, UserRole.ADMIN]), EventController.updateEvent)
router.delete("/:id", authenticate, authorize([UserRole.ORGANIZER, UserRole.ADMIN]), EventController.deleteEvent)

export default router
