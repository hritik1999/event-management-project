import express from "express"
import cors from "cors"
import helmet from "helmet"
import authRoutes from "./routes/auth.routes"
import eventRoutes from "./routes/events.routes"
import bookingRoutes from "./routes/bookings.routes"
import userRoutes from "./routes/users.routes"
import reviewRoutes from "./routes/reviews.routes"
import adminRoutes from "./routes/admin.routes"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reviews", reviewRoutes)
console.log("Routes registered: /api/reviews")
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
    res.send("Event Management API is running")
})

export default app
