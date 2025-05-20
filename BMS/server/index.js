import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { dbConnection } from "./config/dbConnection.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import issuesRoutes from "./routes/issuesRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import officeRoutes from "./routes/officeRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import alertsRoutes from "./routes/alertsRoutes.js";
import uploadFileRoute from "./routes/uploadFileRoute.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors(
    {
        origin: ["http://localhost:5173","https://zeta-bms.vercel.app"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // Allow credentials (cookies, authorization headers)
        allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    },
    
));
dbConnection();
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Visitor Management System API"
    })
})



// Authentication
app.use("/api/v1/auth", authRoutes);

// Visitor Management
app.use("/api/visitors", visitorRoutes);

// Issue Reporting
app.use("/api/issues", issuesRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Office 
app.use("/api/office", officeRoutes);

// Services
app.use("/api/services", servicesRoutes);

// Alerts and Notifications
app.use("/api/alerts", alertsRoutes);

// Upload Files
app.use("/api/files", uploadFileRoute);





app.listen(PORT,"0.0.0.0", ()=>{
    console.log(`server is running on port ${PORT}`);
});



