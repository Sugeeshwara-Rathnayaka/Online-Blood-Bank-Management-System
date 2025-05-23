import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import requesterRoutes from "./routes/requesterRouter.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import bloodBankAdminRoutes from "./routes/bloodBankAdminRoutes.js";
import reservationRoutes from "./routes/donorReservationRouter.js";
import orgRoutes from "./routes/organizationRoutes.js";
import hosRoutes from "./routes/hospitalRouter.js";
import selectRoutes from "./routes/selectRoutes.js";

import connectDB from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: "http://localhost:5173", // Your frontend origin
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/req", requesterRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/bbadmin", bloodBankAdminRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/hos", hosRoutes);
app.use("/api/select", selectRoutes);

app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
