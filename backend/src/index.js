import "dotenv/config";
import express from "express";
import { connectDb } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import colors from "colors";
import cors from 'cors';
import job from "./lib/cron.js";

const app = express();
const port = process.env.PORT || 3000

// MIDDLEWARE
job.start();
app.use(express.json())
app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/book", bookRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.bgGreen.white);
    connectDb();
})