import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if(conn.connection.readyState === 1){
            console.log("DB is already connected");
        }
        if(conn.connection.readyState === 2){
            console.log("DB is already connecting");
        }
       // console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}