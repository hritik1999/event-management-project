import { Request, Response } from "express"
import { AuthService } from "../services/AuthService"

const authService = new AuthService()

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body)
            res.status(201).json(user)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const result = await authService.login(email, password)
            res.status(200).json(result)
        } catch (error: any) {
            res.status(401).json({ message: error.message })
        }
    }
}
