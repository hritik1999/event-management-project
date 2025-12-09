"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = require("../controllers/ReviewController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, ReviewController_1.ReviewController.createReview);
router.get("/event/:eventId", ReviewController_1.ReviewController.getReviewsByEvent);
exports.default = router;
