import express from "express";
import dotenv from "dotenv";

import studentRoutes from "./routes/student.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();
import cors from "cors";
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // add this line
  allowedHeaders: ["Content-Type", "Authorization"],    // add this line
}))


app.use(cookieParser());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Tuition backend is running");
});
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
export default app;
