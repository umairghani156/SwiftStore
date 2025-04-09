import express from "express";
import { getAllHeatmapController, getAllVisitorsStatsController } from "../controllers/analyticController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const analyticsRoutes = express.Router();

// Analytics
analyticsRoutes.get("/all-analytics",authMiddleware, getAllVisitorsStatsController);

// Get All Heatmap
analyticsRoutes.get("/heatmap",authMiddleware, getAllHeatmapController);

export default analyticsRoutes;
