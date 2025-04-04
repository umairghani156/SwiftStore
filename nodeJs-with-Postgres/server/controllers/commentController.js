import prisma from "../DB/db.config.js";

export const createCommentController = async (req, res) => {
    const { postId, userId, comment , parentId } = req.body;
    try {
       
        if(!postId || !userId || !comment) {
            return res.status(400).json({ message: "Post ID, User ID and Comment are required" });
        };


     

        const userExist = await prisma.user.findUnique({
            where:{
                id: userId,
            }
        });
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        };

        const postExist = await prisma.post.findUnique({
            where:{
                id: postId,
            }
        });
        if (!postExist) {
            return res.status(404).json({ message: "Post not found" });
        };
        const updateCommentCount = await prisma.post.update({
            where:{
                id: postId,
            },
            data:{
                comments_count: {
                    increment: 1,
                }
            }
        });

        const newComment = await prisma.comment.create({
            data:{
                comment: comment,
                postId: postId,
                userId: userId,
                parentId: parentId || null,
            }
        });
        if (newComment) {
            return res.status(201).json({ message: parentId ? "Reply created successfully" : "Comment created successfully" });
        } else {
            return res.status(400).json({ message: "Comment not created" });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllCommentsController = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: "desc" // Newest comments first
            },
            include:{
                user: {
                    select:{
                        id: true,
                        name: true,
                    }
                },
                post: {
                    select:{
                        id: true,
                        title: true,
                        description: true,
                    }
                },
                replies:{
                    select:{
                        id: true,
                        comment: true,
                        createdAt: true,
                        user:{
                            select:{
                                id: true,
                                name: true,
                            }
                        }
                    },
                    orderBy:{
                        createdAt: "desc"
                    }
                }
                
            }
        });

        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Comments fetched successfully",
                comments: comments,
            });
        }

        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getCommentController = async (req, res) => {
    const { postId } = req.params;
    if(!postId) {
        return res.status(400).json({ message: "Comment ID is required" });
    };
    try {

       const comment = await prisma.comment.findMany({
        where:{
            postId: postId,
        },
        orderBy: {
            createdAt: "desc" // Newest comments first
        },
        include:{
            user: {
                select:{
                    id: true,
                    name: true,
                }
            },
            post:{
                select:{
                    id: true,
                    title: true,
                    description: true
                }
            }
        }
       })
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        } else {
            return res.status(200).json({
                success: true,
                message: "Comment fetched successfully",
                comment: comment,
            });
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}