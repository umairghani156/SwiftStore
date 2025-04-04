import express from "express";
import { createCommentController, getAllCommentsController, getCommentController } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/create", createCommentController);
commentRouter.get("/get-comments", getAllCommentsController);
commentRouter.get("/get-comment/:postId", getCommentController); 


export default commentRouter;