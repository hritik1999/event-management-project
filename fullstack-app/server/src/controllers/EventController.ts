import { Response } from "express"
import { EventService } from "../services/EventService"
import { AuthRequest } from "../middlewares/auth.middleware"

const eventService = new EventService()

export class EventController {
    static async createEvent(req: AuthRequest, res: Response) {
        try {
            const { ticketTypes, ...eventData } = req.body
            const event = await eventService.createEvent(eventData, req.user.userId, ticketTypes)
            res.status(201).json(event)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }

    static async getOrganizerStats(req: AuthRequest, res: Response) {
        try {
            const stats = await eventService.getOrganizerStats(req.user.userId)
            res.status(200).json(stats)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    static async getAllEvents(req: AuthRequest, res: Response) {
        try {
            const events = await eventService.getAllEvents(req.query)
            res.status(200).json(events)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    static async getEventById(req: AuthRequest, res: Response) {
        try {
            const event = await eventService.getEventById(req.params.id)
            if (!event) return res.status(404).json({ message: "Event not found" })
            res.status(200).json(event)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    static async updateEvent(req: AuthRequest, res: Response) {
        try {
            const event = await eventService.updateEvent(req.params.id, req.user.userId, req.body)
            res.status(200).json(event)
        } catch (error: any) {
            res.status(403).json({ message: error.message })
        }
    }

    static async deleteEvent(req: AuthRequest, res: Response) {
        try {
            await eventService.deleteEvent(req.params.id, req.user.userId)
            res.status(204).send()
        } catch (error: any) {
            res.status(403).json({ message: error.message })
        }
    }
}
