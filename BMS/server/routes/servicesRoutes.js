import express from "express";
import { createServiceController, deleteServiceController, getAllServicesController, getServiceController, updateServiceController } from "../controllers/serviceController.js";

const servicesRoutes = express.Router();

servicesRoutes.post("/", createServiceController);
servicesRoutes.get("/", getAllServicesController);
servicesRoutes.get("/:id", getServiceController);
servicesRoutes.put("/:id", updateServiceController);
servicesRoutes.delete("/:id", deleteServiceController);

export default servicesRoutes;