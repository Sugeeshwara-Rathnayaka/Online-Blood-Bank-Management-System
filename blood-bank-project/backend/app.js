import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmenrRouter from "./router/appointmenrRouter.js";
import adminRouter from "./router/adminRouter.js";
import superAdminRouter from "./router/superAdminRouter.js";
import donorRouter from "./router/donorRouter.js";
import requesterRouter from "./router/requesterRouter.js";
import hospitalRouter from "./router/hospitalRouter.js";
import organizationRouter from "./router/organizationRouter.js";

import bloodRouter from "./router/bloodRouter.js";
import districtRouter from "./router/districtRouter.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmenrRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/superAdmin", superAdminRouter);
app.use("/api/v1/donor", donorRouter);
app.use("/api/v1/requester", requesterRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/organization", organizationRouter);

app.use("/api/v1/blood", bloodRouter);
app.use("/api/v1/district", districtRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
