import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoute.js";
import leaderboardRoutes from "./routes/leaderboardRoute.js";
import statusRoutes from "./routes/StatusRoutes.js";
import dbConnection from "./utils/connectDB.js";

dotenv.config();

dbConnection();

const port = process.env.PORT || 8800;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/user", userRoutes); 
app.use("/api/task", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/status", statusRoutes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));
