"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const data_source_1 = require("../data-source");
const Event_1 = require("../entities/Event");
const TicketType_1 = require("../entities/TicketType");
class EventService {
    constructor() {
        this.eventRepository = data_source_1.AppDataSource.getRepository(Event_1.Event);
        this.ticketTypeRepository = data_source_1.AppDataSource.getRepository(TicketType_1.TicketType);
    }
    createEvent(data, userId, ticketTypesData) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = this.eventRepository.create(Object.assign(Object.assign({}, data), { organizer: { id: userId } }));
            const savedEvent = yield this.eventRepository.save(event);
            if (ticketTypesData && ticketTypesData.length > 0) {
                const ticketTypes = ticketTypesData.map(tt => this.ticketTypeRepository.create(Object.assign(Object.assign({}, tt), { event: savedEvent })));
                yield this.ticketTypeRepository.save(ticketTypes);
                savedEvent.ticketTypes = ticketTypes;
            }
            return savedEvent;
        });
    }
    getAllEvents(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Basic filtering can be expanded
            const query = this.eventRepository.createQueryBuilder("event")
                .leftJoinAndSelect("event.organizer", "organizer")
                .leftJoinAndSelect("event.ticketTypes", "ticketTypes")
                .orderBy("event.date", "ASC");
            if (filters === null || filters === void 0 ? void 0 : filters.category) {
                query.andWhere("event.category = :category", { category: filters.category });
            }
            if (filters === null || filters === void 0 ? void 0 : filters.search) {
                query.andWhere("(event.title ILIKE :search OR event.description ILIKE :search)", { search: `%${filters.search}%` });
            }
            if (filters === null || filters === void 0 ? void 0 : filters.organizerId) {
                query.andWhere("organizer.id = :organizerId", { organizerId: filters.organizerId });
            }
            return yield query.getMany();
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eventRepository.findOne({
                where: { id },
                relations: ["organizer", "ticketTypes", "reviews", "reviews.user"]
            });
        });
    }
    updateEvent(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.findOne({ where: { id }, relations: ["organizer"] });
            if (!event)
                throw new Error("Event not found");
            if (event.organizer.id !== userId) { // Simple check, in real app consider admin override
                throw new Error("Unauthorized");
            }
            Object.assign(event, data);
            return yield this.eventRepository.save(event);
        });
    }
    deleteEvent(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.findOne({ where: { id }, relations: ["organizer"] });
            if (!event)
                throw new Error("Event not found");
            if (event.organizer.id !== userId) {
                throw new Error("Unauthorized");
            }
            return yield this.eventRepository.remove(event);
        });
    }
}
exports.EventService = EventService;
