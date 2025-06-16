import express from "express";
import dotenv from "dotenv";
dotenv.config();
import tutorRoutes from './routes/tutor.routes'
import studentRoutes from "./routes/student.routes";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import path from "path";
const app = express();
import cors from "cors";
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT","PATCH", "DELETE"], 
//    allowedHeaders: ["Content-Type", "Authorization"],    
// }))
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(cookieParser());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Tuition backend is running");
});
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tutor", tutorRoutes);
export default app;
