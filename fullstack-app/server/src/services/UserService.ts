import { AppDataSource } from "../data-source"
import { User, UserRole } from "../entities/User"

export class UserService {
    private userRepository = AppDataSource.getRepository(User)

    async getPendingOrganizers() {
        return await this.userRepository.find({
            where: { role: UserRole.ORGANIZER, isApproved: false }
        })
    }

    async approveOrganizer(id: string) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new Error("User not found")

        user.isApproved = true
        return await this.userRepository.save(user)
    }
}
