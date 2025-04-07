import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController.js';

const productRoutes = express.Router();

productRoutes.post("/create", createProduct);
productRoutes.put("/update/:id", updateProduct);
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getProductById);

export default productRoutes;
