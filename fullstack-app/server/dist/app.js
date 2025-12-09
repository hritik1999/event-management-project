"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const events_routes_1 = __importDefault(require("./routes/events.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const reviews_routes_1 = __importDefault(require("./routes/reviews.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/events", events_routes_1.default);
app.use("/api/bookings", bookings_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/reviews", reviews_routes_1.default);
console.log("Routes registered: /api/reviews");
app.get("/", (req, res) => {
    res.send("Event Management API is running");
});
exports.default = app;
