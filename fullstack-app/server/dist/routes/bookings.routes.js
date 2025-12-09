"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookingController_1 = require("../controllers/BookingController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, BookingController_1.BookingController.createBooking);
router.get("/my-bookings", auth_middleware_1.authenticate, BookingController_1.BookingController.getMyBookings);
exports.default = router;
