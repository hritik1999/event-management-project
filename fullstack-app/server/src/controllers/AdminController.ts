import { Response } from "express";
import { AdminService } from "../services/AdminService";
import { AuthRequest } from "../middlewares/auth.middleware";

const adminService = new AdminService();

export class AdminController {
    static async getStats(req: AuthRequest, res: Response) {
        try {
            const stats = await adminService.getStats();
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch stats" });
        }
    }
}
