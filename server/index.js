import express from "express";
import "dotenv/config";
import productRoutes from "./routes/productRoute.js";
import morgan from "morgan";
import multer from "multer";
import helmet from "helmet";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

//Implement Arcjet 
app.use(async(req, res, next) => { 
    try {
        
        const decision = await aj.protect(req,{
            requested: 1,
        })
        //console.log("Decision", decision);
        if (decision.isDenied()) {
           if(decision.reason.isRateLimit()){
            res.status(429).json({error: "Rate limit exceeded"});
           }else if(decision.reason.isBot()) {
            res.status(403).json({error: "Bot access denied"});
           }else{
            res.status(403).json({error: "Forbidden"});
           }
           return;
        }

        //Check for spoofed Bot
        if(decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed()) ) {
            res.status(403).json({error: "Spoofed bot detected"});
            return
        }
        next();

    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
        
    }
});
app.use("/api/products", productRoutes);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;
            console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Example app listening on port 3000!");
    });
});