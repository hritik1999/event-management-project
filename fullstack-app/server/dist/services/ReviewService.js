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
exports.ReviewService = void 0;
const data_source_1 = require("../data-source");
const Review_1 = require("../entities/Review");
class ReviewService {
    constructor() {
        this.reviewRepository = data_source_1.AppDataSource.getRepository(Review_1.Review);
    }
    createReview(data, userId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.rating || data.rating < 1 || data.rating > 5) {
                throw new Error("Rating must be between 1 and 5");
            }
            const review = this.reviewRepository.create(Object.assign(Object.assign({}, data), { user: { id: userId }, event: { id: eventId } }));
            return yield this.reviewRepository.save(review);
        });
    }
    getReviewsByEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewRepository.find({
                where: { event: { id: eventId } },
                relations: ["user"],
                order: { createdAt: "DESC" }
            });
        });
    }
}
exports.ReviewService = ReviewService;
