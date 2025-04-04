import {sendVerificationEmail } from "../constants/EmailFunc.js";
import admin from "../constants/firebaseAdmin.js";
import { GenerateAccessToken, GenerateRefreshToken } from "../constants/Token.js";
import prisma from "../DB/db.config.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';



export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate user input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
      
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const verificationToken = crypto.randomBytes(3).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 1 * 60 * 1000); 

        // Create user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiry,
                isVerified: false, // Default false until verified
            },
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, return an error
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            const verificationToken = crypto.randomBytes(3).toString("hex");
            const verificationTokenExpiry = new Date(Date.now() + 1 * 60 * 1000);
            await prisma.user.update({
                where: { email: user.email },
                data: {
                    verificationToken,
                    verificationTokenExpiry,
                },
            });
            await sendVerificationEmail(user.email, verificationToken); 
            
            // If user is not verified, send a message to check email
            return res.status(403).json({
                success: false,
                message: "Your account is not verified. A new verification email has been sent. Please check your email.",
            });
        }

        // Generate access token and refresh token
        const accessToken = GenerateAccessToken({ data: user, expiresIn: "2m" });
        const refresh_token = GenerateRefreshToken({ data: user, expiresIn: "24h" });
        
       

        // Set refresh token as a cookie
        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Use secure cookie in production
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,  // 24 hours
        });

        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
        });

    } catch (error) {
        console.error('Error during login:', error);  
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;  // Get refresh token from cookie

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token using the user info from the decoded refresh token
        const newAccessToken = GenerateAccessToken({ data: decoded.user, expiresIn: "2m" });

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed',
            token: newAccessToken,
        });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};


export const logoutUser = (req, res) => {
    
    res.clearCookie('refreshToken', {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',  
    });

    
    return res.status(200).json({ message: 'Logout successful' });
};


export const verifyUserController = async (req, res) =>{
    const { verificationToken } = req.body; 
   
    if (!verificationToken) {
        return res.status(400).json({ message: "Verification token is required" });
    };

    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: verificationToken,
            },
        });

       
        if (!user) {
            return res.status(400).json({ message: "Invalid verification token" });
        }
       
        if (user.verificationTokenExpiry < new Date()) {
            return res.status(400).json({ message: "Verification token has expired" });
        }
        
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isVerified: true,
                verificationToken: null, 
                verificationTokenExpiry: null, // Clear the expiry date
            },
        });

        if (updatedUser) {
            return res.status(200).json({ message: "User verified successfully" });
            }else {
                return res.status(400).json({ message: "User not verified" });
            }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const resendVerificationToken = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({success: false, message: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        const verificationToken = crypto.randomBytes(3).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                verificationToken: verificationToken,
                verificationTokenExpiry: verificationTokenExpiry,
            },
        });

        if (updatedUser) {
            await sendVerificationEmail(user.email, verificationToken);
            return res.status(200).json({ success: true, message: "Verification token sent successfully" });
        } else {
            return res.status(400).json({ success: false, message: "User not updated" });
        }
    } catch (error) {
        console.error("Error resending verification token:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// Verify Google account
export const verifyGoogleAccount = async ( req, res) => {
    const idToken = req.body.idToken; // Get the ID token from the request body
    if (!idToken) {
        return res.status(400).json({success: false, message: "ID token is required" });
    }
  try {
        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken; // Extract user info from the decoded token

        // Check if user already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(200).json({success: true, message: "User already exists", user: existingUser });
        }

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: null, // No password for Google sign-in
                isVerified: true, // Automatically verified for Google sign-in
            },
        });

        return res.status(201).json({success: true, message: "User registered successfully", user: newUser });
    
  } catch (error) {
    return res.status(400).json({success: false, message: "Invalid ID token" });
  }
}
