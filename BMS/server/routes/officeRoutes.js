import express from "express";
import { createOfficeController, getAllOfficesController, getOfficeOccupancyController, updateOfficeController } from "../controllers/officeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const officeRoutes = express.Router();

officeRoutes.post("/",authMiddleware, createOfficeController);
officeRoutes.get("/",authMiddleware, getAllOfficesController);
officeRoutes.patch("/:id",authMiddleware, updateOfficeController);
officeRoutes.get("/occupancy", authMiddleware, getOfficeOccupancyController)
export default officeRoutes;