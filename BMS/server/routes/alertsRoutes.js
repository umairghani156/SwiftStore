import express from "express";
import { createAlertController, createNotificationController, getAlertsByService, getAlertsByType, getAlertsStatsController, getAllAlertsController, getHighFootfallAreas, markAllAlertsAsReadController } from "../controllers/alertController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const alertsRoutes = express.Router();

alertsRoutes.post('/notify', createNotificationController);
alertsRoutes.get("/footfall", getHighFootfallAreas);
alertsRoutes.post("/create-alert", createAlertController);
alertsRoutes.get("/get-alerts",authMiddleware, getAllAlertsController);
alertsRoutes.get("/all-alerts/:id", getAlertsByService);
alertsRoutes.get("/type-wise/:name", getAlertsByType);
alertsRoutes.get("/alert-stats", getAlertsStatsController);
alertsRoutes.put("/updated-alert",authMiddleware, markAllAlertsAsReadController);

export default alertsRoutes;