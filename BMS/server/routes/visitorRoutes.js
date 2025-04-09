import express from "express";
import { 
    checkInController, 
    checkInVisitorController, 
    checkOutVisitorController, 
    checkOutController, 
    deleteVisitorController, 
    getVisitorController, 
    hourlyVisitorFlowController, 
    listsVisitorController, 
    registerVisitorController, 
    totalVisitorsCountController, 
    updateVisitorController,
    getVisitorTrendsController,
    getVisitorAppointmentsController
  } from "../controllers/visitorController.js";
  
import authMiddleware from "../middlewares/authMiddleware.js";

const visitorRoutes = express.Router();

// Create a Visitor
visitorRoutes.post("/register",authMiddleware, registerVisitorController);

// Get All Visitors
visitorRoutes.get("/list",authMiddleware, listsVisitorController);

// Check_in a Visitor
visitorRoutes.patch("/checkin",authMiddleware, checkInVisitorController);

// Check_out a Visitor
visitorRoutes.patch("/checkout",authMiddleware, checkOutVisitorController);

// Get Total Visitors Count
visitorRoutes.get("/totalvisitors-count",authMiddleware, totalVisitorsCountController);

// Get Visitor trends and Density
visitorRoutes.get("/visitor-trends",authMiddleware, getVisitorTrendsController);

// Get a Visitor's All Appointments
visitorRoutes.get("/appointments",authMiddleware, getVisitorAppointmentsController);

// Hourly Visitor Flow
visitorRoutes.get("/hourly-visitor-flow",authMiddleware, hourlyVisitorFlowController);

// Get a Visitor
visitorRoutes.get("/:id",authMiddleware, getVisitorController);

// Update a Visitor
visitorRoutes.put("/update/:id",authMiddleware, updateVisitorController);

// Delete a Visitor
visitorRoutes.delete("/:id",authMiddleware, deleteVisitorController);

// Check In
visitorRoutes.patch("/checkin/:id",authMiddleware, checkInController);

// Check Out
visitorRoutes.patch("/checkout/:id",authMiddleware, checkOutController);



export default visitorRoutes