import { AppDataSource } from "../data-source"
import { User, UserRole } from "../entities/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class AuthService {
    private userRepository = AppDataSource.getRepository(User)

    async register(data: Partial<User>) {
        const { username, email, password, role } = data

        const existingUser = await this.userRepository.findOne({ where: [{ email }, { username }] })
        if (existingUser) {
            throw new Error("User with this email or username already exists")
        }

        const hashedPassword = await bcrypt.hash(password!, 10)

        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            role: role || UserRole.ATTENDEE,
            isApproved: role === UserRole.ORGANIZER ? false : true
        })

        await this.userRepository.save(user)

        // Return user without password
        const { password: _, ...result } = user
        return result
    }

    async login(email: string, password: string) { // Updated to accept email directly
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error("Invalid credentials")
        }

        if (user.role === UserRole.ORGANIZER && !user.isApproved) {
            throw new Error("Account pending approval")
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "10d" } // Updated to 10 days
        )

        const { password: _, ...result } = user
        return { user: result, token }
    }
}
