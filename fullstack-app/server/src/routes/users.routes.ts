import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { authenticate, authorize } from "../middlewares/auth.middleware"
import { UserRole } from "../entities/User"

const router = Router()

router.get("/pending-organizers", authenticate, authorize([UserRole.ADMIN]), UserController.getPendingOrganizers)
router.put("/:id/approve", authenticate, authorize([UserRole.ADMIN]), UserController.approveOrganizer)

export default router
