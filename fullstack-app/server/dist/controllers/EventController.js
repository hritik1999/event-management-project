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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const EventService_1 = require("../services/EventService");
const eventService = new EventService_1.EventService();
class EventController {
    static createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { ticketTypes } = _a, eventData = __rest(_a, ["ticketTypes"]);
                const event = yield eventService.createEvent(eventData, req.user.userId, ticketTypes);
                res.status(201).json(event);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static getOrganizerStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield eventService.getOrganizerStats(req.user.userId);
                res.status(200).json(stats);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield eventService.getAllEvents(req.query);
                res.status(200).json(events);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield eventService.getEventById(req.params.id);
                if (!event)
                    return res.status(404).json({ message: "Event not found" });
                res.status(200).json(event);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield eventService.updateEvent(req.params.id, req.user.userId, req.body);
                res.status(200).json(event);
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
    static deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield eventService.deleteEvent(req.params.id, req.user.userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(403).json({ message: error.message });
            }
        });
    }
}
exports.EventController = EventController;
