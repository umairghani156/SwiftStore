import express from "express";
import { deleteUserController, forgetPasswordController, getAllTenantsController, getAllUsersController, getResetPassword, loginController, resetPasswordController, signupController, updateUserController } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const authRoutes = express.Router();

// User Registration
authRoutes.post("/signup", signupController);   

// User Login
authRoutes.post("/login", loginController);

// Get ALl Users

authRoutes.get("/users", roleMiddleware, getAllUsersController);

// Update a User
authRoutes.put("/users/:id",roleMiddleware, updateUserController);

// Delete a User 
authRoutes.delete("/users/:id",roleMiddleware, deleteUserController);

// Get User by Tenant Role
authRoutes.get("/users/tenant", authMiddleware, getAllTenantsController);

// Forget Password
authRoutes.post("/forget-password", forgetPasswordController);

// Reset Password
authRoutes.put("/reset-password/:id/:token", resetPasswordController);
//authRoutes.get("/reset-password/:id/:token", getResetPassword);


export default authRoutes;

