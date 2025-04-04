import express from "express";
import { createUser, loginUser, logoutUser, refreshAccessToken, resendVerificationToken, verifyGoogleAccount, verifyUserController } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post('/refreshToken', refreshAccessToken); 

// verify Google account
userRouter.post('/verify-google', verifyGoogleAccount); 
// Verify user 
userRouter.post('/verify', verifyUserController);
userRouter.post('/resend-verify', resendVerificationToken); // Assuming you want to resend verification email


userRouter.post('/logout', logoutUser);


export default userRouter;