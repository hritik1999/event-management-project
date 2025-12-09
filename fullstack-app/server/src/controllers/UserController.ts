import { Response } from "express"
import { UserService } from "../services/UserService"
import { AuthRequest } from "../middlewares/auth.middleware"

const userService = new UserService()

export class UserController {
    static async getPendingOrganizers(req: AuthRequest, res: Response) {
        try {
            const users = await userService.getPendingOrganizers()
            res.status(200).json(users)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    static async approveOrganizer(req: AuthRequest, res: Response) {
        try {
            const user = await userService.approveOrganizer(req.params.id)
            res.status(200).json(user)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    }
}
