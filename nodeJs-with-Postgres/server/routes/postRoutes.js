import express from "express";
import { createPostController, deletePostController, getAllPossByUserController, getAllPostsController, getPostController, updatePostController } from "../controllers/postController.js";
import { verifyAccessToken } from "../constants/Token.js";
import prisma from "../DB/db.config.js";

const postRouter = express.Router();

postRouter.post("/create",verifyAccessToken, createPostController);
postRouter.get("/get-posts",verifyAccessToken, getAllPostsController);
postRouter.get("/get-post/:id", getPostController); // Assuming you want to get a single post by ID
postRouter.put("/update-post/:id", updatePostController); // Assuming you want to update a post by ID
postRouter.delete("/delete-post/:id", deletePostController); // Assuming you want to delete a post by ID
postRouter.get("/get-posts-by-user/:userId", getAllPossByUserController); // Assuming you want to get posts by user ID
// Assuming you want to get posts by title

export default postRouter;