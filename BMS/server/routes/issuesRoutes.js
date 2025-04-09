import express from "express";
import { createIssueController, getAllIssueController, getAllIssuesByServiceController, getIssueController, getIssuesStatusController, getUsersIssuesController, updateIssueController } from "../controllers/issuesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { assignIssueMiddleware } from "../middlewares/assignIssueMiddleware.js";

const issuesRoutes = express.Router();

// Create a Report
issuesRoutes.post("/report",authMiddleware, createIssueController);

// Get All Reports
issuesRoutes.get("/",authMiddleware, getAllIssueController);


// Pending, In Progress, Resolved Reports
issuesRoutes.get("/issues-status",authMiddleware, getIssuesStatusController);

// Get a User's All Reports
issuesRoutes.get("/user-issues",authMiddleware, getUsersIssuesController);

// Get All Issues by Service
issuesRoutes.get("/special-issues/:name",authMiddleware, getAllIssuesByServiceController);

// Get a Report
issuesRoutes.get("/:id",authMiddleware, getIssueController);

// Update a Report
issuesRoutes.patch("/:id",authMiddleware,assignIssueMiddleware, updateIssueController);



export default issuesRoutes