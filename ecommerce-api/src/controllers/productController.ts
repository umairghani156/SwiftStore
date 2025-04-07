import { Request, Response } from "express";
export const createProduct = async (req : Request, res: Response) => {
    try {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
}
export const updateProduct = async (req : Request, res: Response) => {
    try {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
}
export const getAllProducts = async (req : Request, res: Response) => {
    try {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully Bhai Jaan" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
}
export const getProductById = async (req : Request, res: Response) => {
    try {
        // Logic to create a product
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
}
