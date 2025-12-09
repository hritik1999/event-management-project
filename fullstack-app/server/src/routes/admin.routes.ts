import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stats", authenticate, authorize(["ADMIN"]), AdminController.getStats);

export default router;
