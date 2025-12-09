import express from "express"
import cors from "cors"
import helmet from "helmet"
import authRoutes from "./routes/auth.routes"
import eventRoutes from "./routes/events.routes"
import bookingRoutes from "./routes/bookings.routes"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/", (req, res) => {
    res.send("Event Management API is running")
})

export default app
