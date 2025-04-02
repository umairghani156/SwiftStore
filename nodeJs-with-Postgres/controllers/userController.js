import prisma from "../DB/db.config.js";
import bcrypt from 'bcryptjs';


export const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    // Validate user input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const exitingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (exitingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data:{
                name: name,
                email: email,
                password: hashedPassword,
            }
        });

        if (newUser) {
            return res.status(201).json({ message: "User created successfully" });
        } else {
            return res.status(400).json({ message: "User not created" });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}